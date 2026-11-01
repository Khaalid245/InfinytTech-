# Multi-stage production Dockerfile for InfinytTech React + Vite Frontend
# Stage 1: Build static assets
FROM node:20-alpine AS builder

WORKDIR /app

# Cache dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application source and build
COPY . .
RUN npm run build

# Stage 2: Serve via Nginx
FROM nginx:1.27-alpine AS runner

# Install curl for healthcheck
RUN apk add --no-cache curl

# Remove default nginx configurations and static files
RUN rm -rf /etc/nginx/conf.d/* /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled production assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
