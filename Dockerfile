FROM nginx:1.21.6-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

WORKDIR /home
COPY certs certs
COPY build build