FROM node:16-bullseye
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5000
CMD [ "npm", "start" ]