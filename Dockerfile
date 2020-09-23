### STAGE 1:Build ###
FROM node:12.18.4-alpine3.9 as build-step

# create working dir
# RUN mkdir -p /app
WORKDIR /usr/src/app

# deps needed for the app
COPY package.json package-lock.json ./

# install packages
RUN npm install
# install angular cli
# RUN npm i -g @angular/cli@10.1.1

# copy any remaining file to the working dir
COPY . .

# build angular app
RUN npm run build --prod

### STAGE 2: Run ###
# need a webserver to serve files
FROM nginx:1.18.0-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-step /usr/src/app/dist/fitness-tracker /usr/share/nginx/html