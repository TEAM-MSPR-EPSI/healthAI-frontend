# ── ÉTAPE 1 : Builder (compilation Angular) ────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Installation des dépendances
RUN npm install --legacy-peer-deps

COPY . .

# Compilation en mode production → génère dist/frontend/browser/
RUN npx ng build --configuration=production

# ── ÉTAPE 2 : Runner (Nginx sert les fichiers statiques) ─
# Node.js + Angular CLI + node_modules disparaissent complètement
FROM nginx:alpine AS runner

# Supprime la page par défaut de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copie UNIQUEMENT les fichiers compilés (HTML/CSS/JS)
# Nom du projet trouvé dans angular.json -> "projects" -> "frontend"
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Config nginx : SPA routing + proxy vers les services backend
RUN printf 'server {\n\
    listen 4200;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    # Proxy → API backend (Express)\n\
    location /api/ {\n\
        proxy_pass http://api_backend:5000;\n\
        proxy_set_header Host $host;\n\
        proxy_set_header X-Real-IP $remote_addr;\n\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n\
    }\n\
\n\
    # Proxy → ETL backend\n\
    location /etl/ {\n\
        proxy_pass http://etl_backend:8000;\n\
        proxy_set_header Host $host;\n\
        proxy_set_header X-Real-IP $remote_addr;\n\
    }\n\
\n\
    location /csv {\n\
        proxy_pass http://etl_backend:8000;\n\
        proxy_set_header Host $host;\n\
        proxy_set_header X-Real-IP $remote_addr;\n\
    }\n\
\n\
    # Proxy → Service exercices\n\
    location /exercices/ {\n\
        proxy_pass http://exercices_service:8002;\n\
        proxy_set_header Host $host;\n\
        proxy_set_header X-Real-IP $remote_addr;\n\
    }\n\
\n\
    # Proxy → Service nutrition (supprime le prefixe /nutrition)\n\
    location /nutrition/ {\n\
        proxy_pass http://nutrition_service:8001/;\n\
        proxy_set_header Host $host;\n\
        proxy_set_header X-Real-IP $remote_addr;\n\
    }\n\
\n\
    # Angular SPA : renvoie index.html pour toutes les routes inconnues\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
