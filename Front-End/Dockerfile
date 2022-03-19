FROM node:alpine as build-stage
RUN mkdir -p /app
WORKDIR /app
ENV PATH node_modules/.bin:$PATH
RUN npm install -g @angular/cli@9.1.15
COPY package.json ./
RUN npm install
COPY . /app
CMD npm run build --prod

FROM nginx:alpine
COPY --from=build-stage /app/dist/src /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200
