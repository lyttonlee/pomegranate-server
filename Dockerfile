FROM daocloud.io/library/node:latest
EXPOSE 9001
RUN rm -rf /app \
    && mkdir /app
WORKDIR /app
COPY . /app
RUN npm install
CMD [ "npm", "start" ]