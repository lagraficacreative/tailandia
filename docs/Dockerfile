# Imagen para Coolify (o cualquier servidor con Docker).
# Sirve la app como web estática con nginx.
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

# Si activas la contraseña en nginx.conf, descomenta también estas dos líneas
# y deja el archivo .htpasswd junto al Dockerfile:
# COPY .htpasswd /etc/nginx/.htpasswd

EXPOSE 80
