FROM wapplerio/node-12

ENV NODE_ENV production
ENV HOST=0.0.0.0
EXPOSE 8080

WORKDIR /opt/node_app
COPY package.json .
RUN npm install --no-optional
CMD [ "npm start" ]
