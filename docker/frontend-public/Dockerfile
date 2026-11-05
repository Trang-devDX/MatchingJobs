FROM node:22-alpine AS build

WORKDIR /frontend/public

RUN corepack enable

COPY ./frontend/public/package.json ./frontend/public/yarn.lock ./frontend/public/.yarnrc.yml ./

RUN yarn install --immutable

COPY ./frontend/tsconfig.base.json /frontend/tsconfig.base.json
COPY ./frontend/shared /frontend/shared
COPY ./frontend/public /frontend/public

RUN yarn build

FROM nginx:alpine

COPY ./docker/frontend-public/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /frontend/public/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
