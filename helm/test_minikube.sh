#!/bin/bash

set -e
# go to repo root
cd $(dirname $0)/..

URL=bikelib.chart-example.local
RELEASE_NAME=test

#######
# API #
#######
export JWT_PASSPHRASE=$(openssl rand -base64 32)
export JWT_SECRET_KEY=$(openssl genpkey -pass file:<(echo "$JWT_PASSPHRASE") -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096)
export JWT_PUBLIC_KEY=$(openssl pkey -in <(echo "$JWT_SECRET_KEY") -passin file:<(echo "$JWT_PASSPHRASE") -pubout)

docker compose -f docker-compose.yml build php caddy

# tag image with sha to force rollingUpdate
php_sha=$(docker inspect bikelib-php --format='{{.Id}}' | cut -d: -f2)
caddy_sha=$(docker inspect bikelib-caddy --format='{{.Id}}' | cut -d: -f2)
docker tag bikelib-php bikelib-php:$php_sha
docker tag bikelib-caddy bikelib-caddy:$caddy_sha

# push images to minikube
for image in bikelib-php:$php_sha bikelib-caddy:$caddy_sha; do
  minikube image ls | grep $image || minikube image load $image
done

# install or update deployment on minikube
helm upgrade --install ${RELEASE_NAME}-api ./helm/api \
  --kube-context minikube \
  --namespace bikelib --create-namespace \
  --atomic \
  --wait \
  --debug \
  -f ./helm/api/values.yml \
  -f ./helm/api/values-minikube.yml \
  --set=php.image.tag=${php_sha} \
  --set=caddy.image.tag=${caddy_sha} \
  --set=ingress.hosts[0].host=${URL} \
  --set=ingress.tls[0].secretName=${RELEASE_NAME}-api-tls \
  --set=ingress.tls[0].hosts[0]=${URL} \
  --set=php.corsAllowOrigin="https?://.*?\.${URL}$" \
  --set=mailer.dsn="smtp://maildev-maildev.maildev:1025" \
  --set=php.corsAllowOrigin="https?://${URL}$" \
  --set=php.trustedHosts="^127\\.0\\.0\\.1|localhost|${URL}$" \
  --set=php.jwt.secretKey="$JWT_SECRET_KEY" \
  --set=php.jwt.publicKey="$(openssl pkey -in <(echo "$JWT_SECRET_KEY") -passin file:<(echo "$JWT_PASSPHRASE") -pubout)" \
  --set=php.jwt.passphrase="$JWT_PASSPHRASE" \
  --set=php.host=${URL} \
  --set=caddy.pwaUpstream="${RELEASE_NAME}-pwa-bikelib-pwa:3000"

#######
# PWA #
#######
docker compose \
  -f docker-compose.yml \
  build pwa \
  --build-arg next_public_entrypoint="$(minikube service --namespace=bikelib ${RELEASE_NAME}-api-bikelib-api --url)"
pwa_sha=$(docker inspect bikelib-pwa --format='{{.Id}}' | cut -d: -f2)
docker tag bikelib-pwa bikelib-pwa:$pwa_sha

# push images to minikube
for image in bikelib-pwa:$pwa_sha; do
  minikube image ls | grep $image || minikube image load $image
done

helm upgrade --install ${RELEASE_NAME}-pwa ./helm/pwa \
  --kube-context minikube \
  --namespace bikelib --create-namespace \
  --atomic \
  --wait \
  --debug \
  -f ./helm/pwa/values-minikube.yml \
  --set=pwa.image.tag=${pwa_sha} \
  --set=pwa.nextPublicEntrypoint=http://${RELEASE_NAME}-api-bikelib-api:80

# Global
MINIKUBE_IP=$(minikube ip)
if ! grep -E "^$MINIKUBE_IP\s+(.+\s+)?${URL}" /etc/hosts; then
	echo Execute \"echo $MINIKUBE_IP ${URL} \| sudo tee -a /etc/hosts\"
	exit=1
fi
if ! grep -E "^$MINIKUBE_IP\s+(.+\s+)?maildev.chart-example.local" /etc/hosts; then
	echo Execute \"echo $MINIKUBE_IP maildev.chart-example.local \| sudo tee -a /etc/hosts\"
	exit=1
fi

if [ -n "$exit" ]; then
    exit 1
fi

open http://${URL}
open http://maildev.chart-example.local
