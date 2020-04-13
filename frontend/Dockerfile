FROM nginx:alpine

ENV PORT 8080
ENV BACKAPI 'https://www.example.com'
ENV BASE_PATH '.'

## Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*
RUN echo '\$BASE_PATH'

## Copy our default nginx config
COPY ${BASE_PATH}/default.conf.template /etc/nginx/conf.d/default.conf.template
COPY ${BASE_PATH}/nginx.conf /etc/nginx/nginx.conf
## COPY ./dev/default.nginx.conf /etc/nginx/conf.d/
## COPY ./dev/nginx.conf /etc/nginx/conf.d/default.conf.template
## COPY ./dev/nginx.conf /etc/nginx/nginx.conf

COPY ${BASE_PATH}/ /usr/share/nginx/html

EXPOSE ${PORT}

CMD /bin/sh -c "envsubst '\$PORT \$BACKAPI' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'
