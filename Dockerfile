FROM golang:1.12-stretch

LABEL maintainer="Colin Chartier <me@colinchartier.com>"

RUN apt-get update && \
    apt-get -y install inotify-tools npm && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /go/src/app
RUN go get github.com/gin-gonic/gin
RUN go get github.com/gin-contrib/multitemplate

COPY package.json package-lock.json .babelrc webpack.config.js .
RUN npm install
COPY app .
COPY entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]