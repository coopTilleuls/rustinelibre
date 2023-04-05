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
for image in bikelib-php:$php_sha bikelib-caddy:$caddy_sha; do
  minikube image ls | grep $image || minikube image load $image
done

# install or update deployment on minikube
helm upgrade --install demo ./helm/chart \
  --kube-context minikube \
  --namespace bikelib --create-namespace \
  --atomic \
  --wait \
  --debug \
  -f ./helm/chart/values-minikube.yml \
  --set   php.image.tag=$php_sha \
  --set caddy.image.tag=$caddy_sha
  --set pwa.image.tag=$pwa_sha

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
