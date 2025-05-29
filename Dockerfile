FROM node:6-alpine

WORKDIR /app

RUN apk --update add bash

COPY docker/index.js .
COPY docker/package.json .
COPY hmEditor.admin.web hmEditor.admin.web


COPY docker/node_modules.tar .
RUN  tar -xvf node_modules.tar && rm -f node_modules.tar


EXPOSE 29099
CMD [ "node", "./index.js" ]
