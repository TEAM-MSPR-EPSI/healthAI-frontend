# ── ÉTAPE 1 : Builder (compilation Angular) ────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install -g @angular/cli@20
RUN npm install --legacy-peer-deps

COPY . .

# Compilation en mode production → génère dist/frontend/browser/
RUN ng build --configuration=production

# ── ÉTAPE 2 : Runner (Nginx sert les fichiers statiques) ─
# Node.js + Angular CLI + node_modules disparaissent complètement
FROM nginx:alpine AS runner

# Supprime la page par défaut de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copie UNIQUEMENT les fichiers compilés (HTML/CSS/JS)
# Nom du projet trouvé dans angular.json -> "projects" -> "frontend"
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Config nginx pour le routing Angular (SPA)
# Sans ca, un refresh sur /dashboard renvoie une 404
RUN printf 'server {\n\
    listen 4200;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
