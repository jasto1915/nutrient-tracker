# --- Stage 1: build the Angular frontend ---
FROM node:22-slim AS frontend

WORKDIR /build
COPY frontend/package*.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Express server, hosting the built frontend ---
FROM node:22-slim

WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev --no-audit --no-fund

COPY backend/ ./backend/

# App.js resolves the frontend bundle at ../frontend/dist/... relative to
# itself, so the two-directory layout is preserved here.
COPY --from=frontend /build/dist ./frontend/dist

WORKDIR /app/backend
EXPOSE 8080
CMD ["node", "App.js"]
