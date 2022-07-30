FROM node:16-bullseye-slim

RUN apt-get update; apt-get -y install fontconfig
COPY ./fonts /usr/shared/fonts
COPY ./fonts /usr/share/fonts/truetype
# refresh system font cache
RUN fc-cache -f -v

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT


ENV PATH /opt/node_app/node_modules/.bin:$PATH
ENV NODE_ENV development
WORKDIR /opt/node_app
COPY index.js .
COPY package.json .
RUN npm install --no-optional
CMD [ "nodemon", "--legacy-watch", "./index.js" ]
