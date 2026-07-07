FROM node:20-alpine AS build

WORKDIR /app

COPY ./frontend/company/package.json ./
COPY ./frontend/company/yarn.lock ./

RUN yarn install

COPY ./frontend/company .

RUN yarn build

FROM nginx:alpine

COPY ./docker/frontend-company/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
