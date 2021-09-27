FROM wapplerio/node-12

ENV HOST=0.0.0.0
EXPOSE 8080

ENV NODE_ENV production
WORKDIR /opt/node_app
COPY package.json ./
RUN npm install --no-optional
CMD [ "nodemon", "--legacy-watch", "./index.js" ]
