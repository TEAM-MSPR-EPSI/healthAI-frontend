FROM node:22-alpine

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install -g @angular/cli@17
RUN npm install

# Copie du code source
COPY . .

EXPOSE 4200

# Démarrage en mode développement
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]