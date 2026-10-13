FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

COPY ./frontend/admin/package.json ./frontend/admin/yarn.lock ./frontend/admin/.yarnrc.yml ./

RUN yarn install --immutable

COPY ./frontend/admin .

RUN yarn build

FROM nginx:alpine

COPY ./docker/frontend-admin/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
