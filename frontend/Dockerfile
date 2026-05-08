# ── STAGE 1: Build the React app ───────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first — cache optimization
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .

# Pass the backend URL as a build argument
ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ── STAGE 2: Serve with Nginx ───────────────────────────────
# React builds to static files — we serve them with Nginx
# Nginx is a web server, much better than npm run dev for production
FROM nginx:alpine

# Copy built React files to Nginx's serving directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config for React Router to work
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]