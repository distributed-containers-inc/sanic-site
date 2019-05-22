#!/usr/bin/env bash

# Entrypoint : We pass in SANIC_ENV from the sanic environment.
# If we're in the production environment, we build once and then execute
# the webserver in release mode.
#
# If we're in development mode, we watch for changes to the app's files
# and automatically reload. Note: We need to "volume mount" the files
# into the container for this to do anything, see sanic.yaml's "deploy"
# command in the dev environment to see the specific -v mounts

if [[ "${SANIC_ENV}" = "prod" ]]; then
    echo "Starting the app in production mode..."
    go build main/main.go
    GIN_MODE=release exec ./main
fi

_start_app() {
    go run main/main.go&
    APP_ID=$!
}

#_term_app : send 5 sigterms over 5 seconds, then a sigkill.
# Returns when $APP_ID is stopped
_term_app() {
    echo "Terminating pid ${APP_ID}..."
    if [[ -n "${APP_ID}" ]]; then
        pkill -9 -P ${APP_ID} #TODO avoid jumping to sigkill eventually
    fi
}

trap "_term_app; exit $?" SIGTERM

for signal in SIGHUP SIGINT; do
    trap "kill -s ${signal} ${APP_ID}" ${signal}
done

echo "Starting the app in development mode..."
_start_app
while true; do
    while inotifywait -r -e create,modify,delete $(find . -name '*.go') $(find static); do
        echo "Noticed a change. Restarting app."
        _term_app
        _start_app
        echo "Restarted."
    done
done