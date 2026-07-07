FROM node:20-alpine AS build

WORKDIR /app

COPY ./frontend/admin/package.json ./
COPY ./frontend/admin/yarn.lock ./

RUN yarn install

COPY ./frontend/admin .

RUN yarn build

FROM nginx:alpine

COPY ./docker/frontend-admin/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
