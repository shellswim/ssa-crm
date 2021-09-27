FROM wapplerio/node-12

ENV HOST 0.0.0.0
ENV PORT 8080

ENV NODE_ENV development
WORKDIR /opt/node_app
COPY package.json ./
RUN npm install --no-optional
CMD [ "nodemon", "--legacy-watch", "./index.js" ]
