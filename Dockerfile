FROM node:latest AS BUILD

WORKDIR /node

COPY ./ /node

RUN yarn
RUN yarn build

FROM nginx
COPY --from=BUILD /node/build /usr/share/nginx/html
EXPOSE 80
