ARG PHP_VERSION=8.3
ARG UID=1000
ARG TZ=UTC

FROM php:${PHP_VERSION}-fpm-alpine

WORKDIR /usr/share/nginx/html/laravel

RUN deluser www-data && adduser -D -u 1000 www-data \
    && mkdir -p /usr/share/nginx/html/laravel \
    && chown -R www-data:www-data /usr/share/nginx/html/laravel

RUN apk add --no-cache \
    curl \
    nano \
    tzdata \
    git \
    unzip \
    ca-certificates \
    supervisor \
    nginx \
    libzip-dev \
    postgresql-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    freetype-dev \
    icu-dev \
    oniguruma-dev \
    libsodium-dev \
    brotli \
    autoconf \
    g++ \
    make \
    libtool \
    pkgconf \
    linux-headers \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install \
    pdo_pgsql \
    mbstring \
    bcmath \
    pcntl \
    zip \
    intl \
    gd \
    opcache \
    exif

RUN pecl channel-update pecl.php.net \
    && (pecl install redis || (sleep 5 && pecl install redis)) \
    && docker-php-ext-enable redis

RUN docker-php-source delete \
    && rm -rf /var/cache/apk/* /tmp/* /var/tmp/*

RUN cp ${PHP_INI_DIR}/php.ini-production ${PHP_INI_DIR}/php.ini

RUN pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && echo "xdebug.mode=off" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.client_host=host.docker.internal" >> ${PHP_INI_DIR}/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.client_port=9003" >> ${PHP_INI_DIR}/docker-php-ext-xdebug.ini \
    && echo "xdebug.start_with_request=yes" >> ${PHP_INI_DIR}/conf.d/docker-php-ext-xdebug.ini

RUN arch="$(uname -m)" \
    && case "$arch" in \
    armhf) _cronic_fname='supercronic-linux-arm' ;; \
    aarch64) _cronic_fname='supercronic-linux-arm64' ;; \
    x86_64) _cronic_fname='supercronic-linux-amd64' ;; \
    x86) _cronic_fname='supercronic-linux-386' ;; \
    *) echo >&2 "error: unsupported architecture: $arch"; exit 1 ;; \
    esac \
    && wget -q "https://github.com/aptible/supercronic/releases/download/v0.2.29/${_cronic_fname}" \
    -O /usr/bin/supercronic \
    && chmod +x /usr/bin/supercronic \
    && mkdir -p /etc/supercronic \
    && echo "*/1 * * * * php /usr/share/nginx/html/laravel/artisan schedule:run --no-interaction" > /etc/supercronic/laravel

RUN mkdir -p /etc/supervisor/conf.d /var/log/supervisor /var/run/supervisor /var/log/nginx /var/lib/nginx /run \
    && chown -R www-data:www-data /usr/share/nginx/html/laravel /var/log /var/run /var/log/nginx /var/lib/nginx /run \
    && chmod -R a+rw /usr/share/nginx/html/laravel /var/log /var/run /run

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY 99-php.ini ${PHP_INI_DIR}/conf.d/99-php.ini
COPY www.conf /etc/php-fpm.d/www.conf
COPY supervisord.conf /etc/
COPY supervisord.laravel.conf /etc/supervisor/conf.d/
COPY supervisord.nginx.conf /etc/supervisor/conf.d/
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 8080 9000

CMD ["supervisord", "-c", "/etc/supervisord.conf"]
