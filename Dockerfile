FROM node:20.11.0

WORKDIR /usr/src/face-spotter-api

COPY ./ ./

RUN npm install 
CMD ["bash"]