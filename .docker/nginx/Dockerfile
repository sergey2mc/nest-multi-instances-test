FROM nginx:1.23.2-alpine

ARG PORT
ARG HOST

COPY nginx.conf /etc/nginx/nginx.conf.template
RUN envsubst '${PORT} ${HOST}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
