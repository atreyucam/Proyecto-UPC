# 1️⃣ Usa la imagen oficial de Node.js
FROM node:18

# 2️⃣ Establece el directorio de trabajo
WORKDIR /app

# 3️⃣ Copia los archivos necesarios
COPY package.json package-lock.json ./

# 4️⃣ Instala las dependencias
RUN npm install --production

# 5️⃣ Copia el resto del código
COPY . .

# 6️⃣ Expone el puerto de la aplicación
EXPOSE 3000

# 7️⃣ Ejecuta la sincronización y luego arranca el servidor
CMD ["sh", "-c", "node config/syncDatabase.js && node config/initData.js && node server.js"]
