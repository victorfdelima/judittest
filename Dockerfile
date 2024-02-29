# Base image
FROM node:16-alpine

#env
ENV MONGO_INITDB_ROOT_USERNAME=root
ENV MONGO_INITDB_ROOT_PASSWORD=82384580vV!
ENV DATABASE_URI=mongodb+srv://root:82384580vV!@judit.mswln4j.mongodb.net/?retryWrites=true&w=majority&appName=judit
ENV APIKEY=7fae0caf-060a-444c-a8ba-9d7966463700

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build