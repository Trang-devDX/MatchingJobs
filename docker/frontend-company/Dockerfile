FROM node:22-alpine AS build

WORKDIR /frontend/company

RUN corepack enable

COPY ./frontend/company/package.json ./frontend/company/yarn.lock ./frontend/company/.yarnrc.yml ./

RUN yarn install --immutable

COPY ./frontend/tsconfig.base.json /frontend/tsconfig.base.json
COPY ./frontend/shared /frontend/shared
COPY ./frontend/company /frontend/company

RUN yarn build

FROM nginx:alpine

COPY ./docker/frontend-company/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /frontend/company/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
