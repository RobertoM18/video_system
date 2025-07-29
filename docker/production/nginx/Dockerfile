FROM php:8.4-fpm

RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    git \
    curl \
    unzip \
    libpq-dev \
    libonig-dev \
    libssl-dev \
    libxml2-dev \
    libcurl4-openssl-dev \
    libicu-dev \
    libzip-dev \
    && docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    pdo_pgsql \
    pgsql \
    opcache \
    intl \
    zip \
    bcmath \
    soap \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
# Install Node.js (for Laravel Mix, if needed)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt update && \
    apt install -y nodejs

# Copy application code
WORKDIR /var/www
COPY . .

# Set permissions
RUN chown -R www-data:www-data /var/www/bootstrap/cache /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache /var/www/storage

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer install --no-dev --optimize-autoloader --no-interaction --no-progress --prefer-dist

RUN npm install && npm run build
RUN php artisan migrate --force && php artisan db:seed --force
RUN php artisan optimize && \
    php artisan optimize:clear && \
    php artisan config:cache && \
    php artisan view:cache

# Copy Nginx config
COPY docker/production/nginx/nginx.conf /etc/nginx/nginx.conf

# Copy Supervisor config
COPY docker/production/nginx/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose HTTP port
EXPOSE 8000

# Start Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
