FROM node:alpine
WORKDIR /home/node/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

CMD npm run execute

# EXAMPLE: 
# Build: sudo docker build -t godaddy_dyn_dns .
# Run: sudo docker run -d --name godaddy_dyn_dns godaddy_dyn_dns