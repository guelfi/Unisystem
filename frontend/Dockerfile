# Build stage
FROM node:22-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code and build files
COPY . .

# Build for production with correct base href
ARG BASE_HREF=/unisystem/
ARG API_URL=/unisystem-api/api
RUN node -e 'const fs=require("fs"); fs.writeFileSync("src/environments/environment.prod.ts", "export const environment = " + JSON.stringify({production:true,apiUrl:process.env.API_URL}) + ";\n")'
RUN npm run build -- --configuration production --base-href="$BASE_HREF"

# Runtime stage with nginx
FROM nginx:alpine AS final
WORKDIR /usr/share/nginx/html

# Remove default nginx files
RUN rm -rf ./*

# Copy built files
COPY --from=build /app/dist/frontend/browser ./

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
