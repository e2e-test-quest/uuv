FROM node:22.22.2-bullseye-slim AS base

ENV HOME="/app"

ADD .output $HOME

RUN cd $HOME/server && \
    npm install sqlite3

WORKDIR $HOME

EXPOSE 3000

CMD [ "node", "/app/server/index.mjs" ]
