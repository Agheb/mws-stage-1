FROM node:9

RUN mkdir /app
WORKDIR ./app
COPY ./package.json /app
RUN npm install
COPY . /app
EXPOSE 1337
CMD ["node","server"]


