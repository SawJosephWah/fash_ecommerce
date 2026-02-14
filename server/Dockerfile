# Use the specific Node version requested
FROM node:25.3.0-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker cache
# Since we build from root, path is client/package.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the client source code
COPY . .

EXPOSE 5173

# Run the development server
CMD ["npm", "run", "dev"]