# backend/Dockerfile
FROM node:18-alpine AS development

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY yarn.lock* ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS production

WORKDIR /app

# Copiar package.json y archivos de lock
COPY package*.json ./
COPY yarn.lock* ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Copiar archivos construidos desde la etapa de desarrollo
COPY --from=development /app/dist ./dist
COPY --from=development /app/node_modules ./node_modules

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/main"]