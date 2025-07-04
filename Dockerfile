# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Копируем package*.json
COPY package*.json ./
RUN npm install --legacy-peer-deps
# Добавляем поддержку переменных среды
ARG REACT_APP_SERVER_URL
ENV REACT_APP_SERVER_URL=${REACT_APP_SERVER_URL}
# Добавляем поддержку REACT_APP_TINY_API_KEY
ARG REACT_APP_TINY_API_KEY
ENV REACT_APP_TINY_API_KEY=${REACT_APP_TINY_API_KEY}
# Копируем остальные файлы и собираем приложение

COPY . .
RUN npm run build
# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
