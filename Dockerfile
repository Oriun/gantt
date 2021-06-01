FROM node:latest AS BUILD

WORKDIR /node

COPY ./ /node

RUN npm install -g -y npm serve yarn
RUN yarn
RUN yarn build

EXPOSE 5000

CMD ["serve", "-s", "build"]