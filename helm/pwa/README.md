# Chart HELM

to test locally with [minikube](https://minikube.sigs.k8s.io/docs/)

```bash
minikube start
minikube addons enable ingress
kubectx minikube
kubectl create ns bikelib-pwa
kubens bikelib-pwa
```

get minikube ip via `minikube ip`

add in your `/etc/hosts` file:

```
192.168.x.x bikelib-pwa.chart-example.local maildev.chart-example.local
```

Then run `./test_minikube.sh` to build prod images, push them to minikube and deploy the app with helm
