FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

COPY ./frontend/company/package.json ./frontend/company/yarn.lock ./frontend/company/.yarnrc.yml ./

RUN yarn install --immutable

COPY ./frontend/company .

RUN yarn build

FROM nginx:alpine

COPY ./docker/frontend-company/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
