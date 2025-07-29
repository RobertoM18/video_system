FROM php:8.4-fpm

# Install system dependencies
RUN apt update && apt install -y \
    nginx \
    supervisor \
    git \
    unzip \
    curl \
    && apt clean

# Install PHP extensions as needed
RUN docker-php-ext-install pdo pdo_mysql pgsql zip bcmath

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Node.js (for Laravel Mix, if needed)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt update && \
    apt install -y nodejs

# Copy application code
WORKDIR /var/www
COPY . .

# Copy Nginx config
COPY docker/production/nginx/nginx.conf /etc/nginx/nginx.conf

# Copy Supervisor config
COPY docker/production/nginx/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Set permissions
RUN chown -R www-data:www-data /var/www

# Expose HTTP port
EXPOSE 80

# Start Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
