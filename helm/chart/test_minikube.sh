#!/bin/bash

set -e
# go to repo root
cd $(dirname $0)/../../

# build all images, without dev overrides
docker compose -f docker-compose.yml build

# tag image with sha to force rollingUpdate
php_sha=$(docker inspect bikelib-php --format='{{.Id}}' | cut -d: -f2)
caddy_sha=$(docker inspect bikelib-caddy --format='{{.Id}}' | cut -d: -f2)
pwa_sha=$(docker inspect bikelib-pwa --format='{{.Id}}' | cut -d: -f2)
docker tag bikelib-php bikelib-php:$php_sha
docker tag bikelib-caddy bikelib-caddy:$caddy_sha
docker tag bikelib-pwa bikelib-pwa:$pwa_sha

# push images to minikube
#minikube image load bikelib-php:$php_sha
#minikube image load bikelib-caddy:$caddy_sha
for image in bikelib-php:$php_sha bikelib-caddy:$caddy_sha bikelib-pwa:$pwa_sha; do
  minikube image ls | grep $image || minikube image load $image
done

URL=bikelib.chart-example.local
RELEASE_NAME=test
APP_JWT_PASSPHRASE=$(openssl rand -base64 32)
APP_JWT_SECRET_KEY=$(openssl genpkey -pass file:<(echo "$APP_JWT_PASSPHRASE") -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096)
APP_JWT_PUBLIC_KEY=$(openssl pkey -in <(echo "$APP_JWT_SECRET_KEY") -passin file:<(echo "$APP_JWT_PASSPHRASE") -pubout)
MERCURE_JWT_PUBLIC_KEY=$(openssl genpkey -pass file:<(echo "$APP_JWT_PASSPHRASE") -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096)
MERCURE_EXTRA_DIRECTIVES=$(cat <<EOF
cors_origins http://localhost:8080 http://localhost:8081 https://localhost http://localhost https://${URL}
EOF
)
TRUSTED_HOSTS="^127.0.0.1|localhost|${URL}|${RELEASE_NAME}-bikelib$"

# install or update deployment on minikube
helm upgrade --install ${RELEASE_NAME} ./helm/chart \
  --kube-context minikube \
  --namespace bikelib --create-namespace \
  --atomic \
  --wait \
  --debug \
  --set=php.image.tag=${php_sha} \
  --set=caddy.image.tag=${caddy_sha} \
  --set=pwa.image.tag=${pwa_sha} \
  --set=ingress.hosts[0].host=${URL} \
  --set=ingress.tls[0].secretName=${RELEASE_NAME}-api-tls \
  --set=ingress.tls[0].hosts[0]=${URL} \
  --set=php.corsAllowOrigin="https?://.*?\.${URL}$" \
  --set=mailer.dsn="smtp://maildev-maildev.maildev:1025" \
  --set=php.corsAllowOrigin="https?://${URL}$" \
  --set=php.trustedHosts="${TRUSTED_HOSTS//./\\\\.}" \
  --set=php.jwt.secretKey="$APP_JWT_SECRET_KEY" \
  --set=php.jwt.publicKey="$APP_JWT_PUBLIC_KEY" \
  --set=php.jwt.passphrase="$APP_JWT_PASSPHRASE" \
  --set=php.host=${URL} \
  --set=mercure.publicUrl=https://${URL}/.well-known/mercure \
  --set=mercure.jwtSecret="${MERCURE_JWT_PUBLIC_KEY}" \
  --set=mercure.extraDirectives="${MERCURE_EXTRA_DIRECTIVES}" \
  -f ./helm/chart/values.yml \
  -f ./helm/chart/values-minikube.yml

MINIKUBE_IP=$(minikube ip)
if ! grep -E "^$MINIKUBE_IP\s+(.+\s+)?bikelib.chart-example.local" /etc/hosts; then
	echo Execute \"echo $MINIKUBE_IP bikelib.chart-example.local \| sudo tee -a /etc/hosts\"
	exit=1
fi
if ! grep -E "^$MINIKUBE_IP\s+(.+\s+)?maildev.chart-example.local" /etc/hosts; then
	echo Execute \"echo $MINIKUBE_IP maildev.chart-example.local \| sudo tee -a /etc/hosts\"
	exit=1
fi

if [ -n "$exit" ]; then
    exit 1
fi

open http://bikelib.chart-example.local
open http://maildev.chart-example.local
