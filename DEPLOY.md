# Préliminaire

Pour pouvoir déployer l'application, vous devez à minima vous munir de :
- @TODO: expliquer Firebase et pourquoi il le faut
- d'un bucket S3, de type Google Cloud Storage (avec compatibilité S3), Amazon S3 ou MinIO (open-source) pour le stockage des médias.
- d'un fournisseur de mails, de type Mailgun ou Brevo pour l'envoi des mails.

# Déploiement

Deux solutions sont proposées pour le déploiement de l'application :
1. Premièrement un déploiement sur un cluster Kubernetes en utilisant le chart helm fourni
2. Deuxièmement un déploiement sur une machine virtuelle (type VPS) en utilisant Docker

## Sur Kubernetes en utilisant le chart helm

Vous devez disposer sur votre machine de [Docker desktop](https://docs.docker.com/desktop) ou [Docker server](https://docs.docker.com/engine/install/#server) (à privilégier sous GNU/Linux).

La première étape consiste à cloner le dépôt Git :
```sh
git clone https://github.com/coopTilleuls/bikelib.git
```

Puis à vous positionner sur le dernier tag (release) au moyen de la commande suivante :
```sh
export LATEST_TAG=$(git describe --tags `git rev-list --tags --max-count=1`)
git switch -d $LATEST_TAG
```

Ensuite, créer un fichier `.env` qui contiendra les variables de build pour la PWA :
```conf
# PWA build-args
NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY=!A_Changer!
NEXT_PUBLIC_FIREBASE_API_KEY=!A_Changer!
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=!A_Changer!
NEXT_PUBLIC_FIREBASE_PROJECT_ID=!A_Changer!
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=!A_Changer!
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=!A_Changer!
NEXT_PUBLIC_FIREBASE_APP_ID=!A_Changer!
NEXT_PUBLIC_VAPID_KEY=!A_Changer!
```

À partir de là, lancer le build des images :
```sh
docker compose -f docker-compose.yml -f docker-compose.prod.yml build
```

Ne pas se soucier des messages quant au fait que des variables sont manquantes. Elles ne sont pas nécessaires au build des images.

Maintenant que les images sont build, il est nécessaire de les tagguer et de les envoyer sur un registre Docker/OCI de votre choix.

Par exemple pour Docker Hub :
```sh
# bikelib-php (API)
docker tag bikelib-php hub.docker.com/monutilisateur/monnamespace/bikelib-php:${LATEST_TAG}
docker push hub.docker.com/monutilisateur/monnamespace/bikelib-php:${LATEST_TAG}
# bikelib-caddy (API)
docker tag bikelib-caddy hub.docker.com/monutilisateur/monnamespace/bikelib-caddy:${LATEST_TAG}
docker push hub.docker.com/monutilisateur/monnamespace/bikelib-caddy:${LATEST_TAG}
# bikelib-pwa (PWA)
docker tag bikelib-pwa hub.docker.com/monutilisateur/monnamespace/bikelib-pwa:${LATEST_TAG}
docker push hub.docker.com/monutilisateur/monnamespace/bikelib-pwa:${LATEST_TAG}
```

## Sur une machine virtuelle en utilisant Docker

Vous devez disposer d'une machine virtuelle où vous aurez au préalable installé [Docker server](https://docs.docker.com/engine/install/#server). Théoriquement le déploiement devrait fonctionner également avec Docker desktop pour Linux, mais ce scénario n'a pas été testé.

La première étape consiste à cloner le dépôt Git :
```sh
git clone https://github.com/coopTilleuls/bikelib.git
```

Puis à vous positionner sur le dernier tag (release) au moyen de la commande suivante :
```sh
git switch -d $(git describe --tags `git rev-list --tags --max-count=1`)
```

### Création du fichier de variables

Vous allez devoir définir quelques variables qui seront ensuite utilisées pour générer le fichier de variables d'environnement
```sh
export APP_URL=bikelib.mondomaine.com # À modifier
export APP_JWT_PUBLIC_KEY=$(openssl rand -base64 32)
export APP_JWT_PASSPHRASE=$(openssl rand -base64 32)
export APP_JWT_SECRET_KEY=$(openssl genpkey -pass file:<(echo "$APP_JWT_PUBLIC_KEY") -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096)
export APP_JWT_PUBLIC_KEY=$(openssl pkey -in <(echo "$APP_JWT_SECRET_KEY") -passin file:<(echo "$APP_JWT_PUBLIC_KEY") -pubout)
export MERCURE_JWT_PUBLIC_KEY=$(openssl genpkey -pass file:<(echo "$APP_JWT_PASSPHRASE") -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096)
export MERCURE_EXTRA_DIRECTIVES=$(cat <<EOF
cors_origins http://localhost:8080 http://localhost:8081 https://localhost http://localhost https://${APP_URL}
EOF
)
export APP_SECRET=$(openssl rand -base64 21)
export POSTGRES_PASSWORD=$(pwgen -s 25 1)
# Mercure keys
ssh-keygen -t rsa -b 4096 -m PEM -f publisher.key
openssl rsa -in publisher.key -pubout -outform PEM -out publisher.key.pub
ssh-keygen -t rsa -b 4096 -m PEM -f subscriber.key
openssl rsa -in subscriber.key -pubout -outform PEM -out subscriber.key.pub
```

Exécutez la commande suivante pour générer les clés nécessaires et les ajouter à un fichier `.env` :
```sh
tee -a .env <<EOF
# PWA build args
NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY=!A_Changer!
NEXT_PUBLIC_FIREBASE_API_KEY=!A_Changer!
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=!A_Changer!
NEXT_PUBLIC_FIREBASE_PROJECT_ID=!A_Changer!
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=!A_Changer!
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=!A_Changer!
NEXT_PUBLIC_FIREBASE_APP_ID=!A_Changer!
NEXT_PUBLIC_VAPID_KEY=!A_Changer!
# API env vars
WEB_APP_URL=${APP_URL}
APP_SECRET=${APP_SECRET}
DATABASE_URL=postgresql://app:${POSTGRES_PASSWORD}@database:5432/app?serverVersion=15&charset=utf8
JWT_SECRET_KEY=$(tr -d '\n' <<<$APP_JWT_SECRET_KEY)
JWT_PUBLIC_KEY=$(tr -d '\n' <<<$APP_JWT_PUBLIC_KEY)
JWT_PASSPHRASE=$(tr -d '\n' <<<$APP_JWT_PASSPHRASE)
## Mail config
MAILER_SENDER=bikelib@${APP_URL}
MAILER_DSN=mailgun+api://DOMAIN_API_KEY:DOMAIN@default?region=eu
## Firebase
FIREBASE_PROJECT_ID=!A_Changer!
FIREBASE_PRIVATE_KEY_ID=!A_Changer!
FIREBASE_PRIVATE_KEY=!A_Changer!
FIREBASE_CLIENT_EMAIL=!A_Changer!
FIREBASE_CLIENT_ID=!A_Changer!
FIREBASE_AUTH_URI=!A_Changer!
FIREBASE_TOKEN_URI=!A_Changer!
FIREBASE_AUTH_PROVIDER=!A_Changer!
FIREBASE_CLIENT_CERT_URL=!A_Changer!
FIREBASE_UNIVERSE_DOMAIN=!A_Changer!
## S3 Storage
STORAGE_BUCKET=!A_Changer!
STORAGE_ENDPOINT=!A_Changer!
STORAGE_REGION=!A_Changer!
STORAGE_USE_PATH_STYLE_ENDPOINT=true
STORAGE_KEY=!A_Changer!
STORAGE_SECRET=!A_Changer!
# Caddy env vars
MERCURE_SUBSCRIBER_JWT_KEY=$(tr -d '\n' < subscriber.key.pub)
MERCURE_EXTRA_DIRECTIVES=${MERCURE_EXTRA_DIRECTIVES}
MERCURE_PUBLISHER_JWT_KEY=$(tr -d '\n' < publisher.key.pub)
# PostgreSQL env vars
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
EOF
```

### Build des images

À partir de là, lancer le build des images :
```sh
docker compose -f docker-compose.yml -f docker-compose.prod.yml build
```

### Créer ou recréer les conteneurs

Une fois qu'elles sont build, vous n'avez plus qu'à lancer les conteneurs en mode détaché :
```sh
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Si besoin de consulter les logs, exécuter la commande suivante :
```sh
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f
```

Si besoin de repartir de zéro, exécuter la commande suivante :
```sh
docker compose -f docker-compose.yml -f docker-compose.prod.yml down
# Ou, en supprimant aussi les volumes :
docker compose -f docker-compose.yml -f docker-compose.prod.yml down --volumes
```

### Mettre à jour
Pour mettre à jour le déploiement (cas d'une nouvelle release de bikelib par exemple), exécuter les commandes suivantes : 
```sh
# On télécharge les nouvelles références du dépôt distant
git fetch origin
# On se place sur le dernier tag (release)
git switch -d $(git describe --tags `git rev-list --tags --max-count=1`)
# On rebuild les images
docker compose -f docker-compose.yml -f docker-compose.prod.yml build
# On met à jour les conteneurs
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```