FROM node:latest AS BUILD

WORKDIR /node

COPY ./ /node

RUN yarn add serve
RUN yarn
RUN yarn build

EXPOSE 5000

CMD ["serve", "-s", "build"]