FROM node:18

WORKDIR /app

COPY ./app/ /app/

RUN apt-get update && apt-get install -y curl

RUN cd /app && npm install && npm install --save-dev @testing-library/svelte

EXPOSE 5137

ENTRYPOINT /app/entrypoint.sh
