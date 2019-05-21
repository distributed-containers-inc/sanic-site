FROM golang:1.12-stretch

LABEL maintainer="Colin Chartier <me@colinchartier.com>"

RUN apt-get update && \
    apt-get -y install inotify-tools && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /go/src/app
RUN go get github.com/gin-gonic/gin

COPY *.go templates/ ./
COPY entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]