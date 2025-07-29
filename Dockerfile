<<<<<<< HEAD
FROM ubuntu:latest
LABEL authors="frank"
ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && \
    apt install -y curl unzip ca-certificates gnupg software-properties-common && \
    rm -rf /var/lib/apt/lists/*

RUN add-apt-repository ppa:ondrej/php

RUN apt update && \
    apt install -y php8.4-cli  \
    php8.4-fpm  \
    php8.4-pgsql  \
    php8.4-zip  \
    php8.4-curl \
    php8.4-mbstring  \
    php8.4-curl \
    php8.4-fileinfo \
    php8.4-sqlite3 \
    php8.4-zip &&\
    rm -rf /var/lib/apt/lists/*

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer global require laravel/installer

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt install -y nodejs

WORKDIR /var/www/html
COPY . .

RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html/storage && \
    chmod -R 755 /var/www/html/bootstrap/cache \

RUN composer install && \
    npm install && \
    npm run build && \
    php artisan migrate --force \

EXPOSE 80
CMD ["php-fpm", "-F"]
=======
FROM webdevops/php-nginx:7.4-alpine

# Install Laravel framework system requirements (https://laravel.com/docs/8.x/deployment#optimizing-configuration-loading)
RUN apk add oniguruma-dev postgresql-dev libxml2-dev nodejs npm
RUN docker-php-ext-install \
        bcmath \
        ctype \
        fileinfo \
        json \
        mbstring \
        pdo_mysql \
        pdo_pgsql \
        tokenizer \
        xml
# Copy Composer binary from the Composer official Docker image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

ENV WEB_DOCUMENT_ROOT /app/public
ENV APP_ENV production
WORKDIR /app
COPY . .

RUN npm install && npm run build
RUN composer install --no-interaction --optimize-autoloader --no-dev
# Optimizing Configuration loading
RUN php artisan config:cache
# Optimizing Route loading
RUN php artisan route:cache
# Optimizing View loading
RUN php artisan view:cache

RUN chown -R application:application .
>>>>>>> 345a9f2d49ec3b0d6f5ca5c00b4712c9a6ab0fa5
