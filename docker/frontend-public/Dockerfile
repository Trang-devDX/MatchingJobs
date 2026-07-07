FROM node:20-alpine AS build

WORKDIR /app

COPY ./frontend/public/package.json ./
COPY ./frontend/public/yarn.lock ./

RUN yarn install

COPY ./frontend/public/ .

RUN yarn build

FROM nginx:alpine

COPY ./docker/frontend-public/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
