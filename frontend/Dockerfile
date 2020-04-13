FROM nginx:alpine

ENV PORT 8080
ENV BACKAPI 'https://www.example.com'

## Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*
RUN echo '\$BASE_PATH'

## Copy our default nginx config
COPY ./default.conf.template /etc/nginx/conf.d/default.conf.template
COPY ./nginx.conf /etc/nginx/nginx.conf
## COPY ./dev/default.nginx.conf /etc/nginx/conf.d/
## COPY ./dev/nginx.conf /etc/nginx/conf.d/default.conf.template
## COPY ./dev/nginx.conf /etc/nginx/nginx.conf

COPY ./ /usr/share/nginx/html

EXPOSE ${PORT}

CMD /bin/sh -c "envsubst '\$PORT \$BACKAPI' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'
