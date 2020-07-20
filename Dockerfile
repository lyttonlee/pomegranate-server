FROM daocloud.io/library/node:latest
EXPOSE 9001
WORKDIR /app
RUN npm install
CMD [ "npm", "start" ]