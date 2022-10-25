FROM node:16-alpine3.15 as builder
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine3.15
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY --from=builder /usr/src/app/dist ./dist
CMD npm start