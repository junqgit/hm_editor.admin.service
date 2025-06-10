FROM node:6-alpine

WORKDIR /app

RUN apk --update add bash

COPY docker/index.js .
COPY docker/package.json .
COPY hm_editor.admin.web hm_editor.admin.web


COPY docker/node_modules.tar .
RUN  tar -xvf node_modules.tar && rm -f node_modules.tar


EXPOSE 23071
CMD [ "node", "./index.js" ]
