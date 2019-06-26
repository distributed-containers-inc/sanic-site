FROM golang:1.12.5 AS gobuild

LABEL maintainer="Colin Chartier <me@colinchartier.com>"

RUN echo hello
WORKDIR /src
COPY app/main.go .
RUN go get -d ./...
RUN go build -o sanicsite

FROM node:8.16.0-jessie AS nodebuild

WORKDIR /src
COPY package.json package-lock.json .babelrc webpack.config.js ./
RUN npm install
COPY app ./app
RUN ./node_modules/.bin/webpack

FROM debian:jessie
COPY --from=gobuild /src/sanicsite /app/sanicsite
COPY --from=nodebuild /src/app /app
WORKDIR /app

ENTRYPOINT ["/app/sanicsite"]