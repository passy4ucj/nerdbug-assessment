FROM registry.ubx.ph/utilities/devops/pipeline-container:node18-aws

WORKDIR /app

COPY package*.json ./
RUN npm config rm proxy
RUN npm config rm https-proxy
RUN npm install

COPY . .

RUN echo "List folders and files.."
RUN ls /app -ltr

ENV PORT 5000
EXPOSE $PORT
CMD [ "npm", "run", "start" ]
