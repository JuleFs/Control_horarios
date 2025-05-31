# frontend/Dockerfile
# Etapa 1: Build de la aplicación React
FROM node:18-alpine as build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY yarn.lock* ./

# Instalar dependencias
RUN npm ci --silent

# Copiar código fuente
COPY . .

# Variables de entorno para build
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Construir la aplicación para producción
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:stable-alpine

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos construidos
COPY --from=build /app/build /usr/share/nginx/html

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S reactjs -u 1001

# Exponer puerto
EXPOSE 80

# Comando para ejecutar nginx
CMD ["nginx", "-g", "daemon off;"]