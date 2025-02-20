# 1. Usar una imagen oficial de Node.js
FROM node:18

# 2. Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar archivos del proyecto al contenedor
COPY package.json package-lock.json ./

# 4. Instalar dependencias
RUN npm install --production

# 5. Copiar el resto del código fuente
COPY . .

# 6. Definir variable de entorno del puerto
ENV PORT=3000

# 7. Exponer el puerto que usa el backend
EXPOSE $PORT

# 8. Comando para iniciar la aplicación
CMD ["node", "server.js"]