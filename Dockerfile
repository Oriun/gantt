FROM node:latest AS BUILD

WORKDIR /node

COPY ./ /node

RUN npm install -g -y npm serve
RUN npm install -y --legacy-peer-deps
RUN npm run build


FROM node:latest

WORKDIR /build

COPY --from=BUILD /node/build /build

RUN npm install -g -y serve

EXPOSE 5000

CMD ["serve", "-s", "build"]