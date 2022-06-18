FROM node:16 as node
WORKDIR /app
COPY . .
RUN npm install --force
RUN npm run build --prod
#stage 2
FROM nginx:alpine
COPY --from=node /app/dist/Front-End /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/