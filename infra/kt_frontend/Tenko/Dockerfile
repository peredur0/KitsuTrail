FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./

RUN npm install -g @angular/cli
RUN npm ci

COPY . .

RUN npm run build -- --configuration production

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/kitsu-trail/browser /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
