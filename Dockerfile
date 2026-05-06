# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Argumentos necesarios para Vite (deben estar presentes en build-time)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_GATEWAY_URL

# Pasamos los args como env variables para el build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_GATEWAY_URL=$VITE_GATEWAY_URL

RUN npm run build

# ── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM node:22-alpine
WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 5173

# -s (single-page app): redirige cualquier ruta a index.html → soporte React Router
CMD ["serve", "-s", "dist", "-l", "5173"]
