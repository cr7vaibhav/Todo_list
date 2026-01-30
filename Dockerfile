# Use an official node.js runtime as a parent image
FROM node:25.3.0-alpine

# set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json .

# install the dependencies 
RUN npm install

# Copy your Prisma config and schema (required for Prisma 7)
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Generate the client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# expose the port that the app runs on
EXPOSE 5003

# define the command to run your application
CMD ["node","./src/server.js"]