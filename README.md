# Bikelib

Plateforme de mise en relation avec des réparateurs de vélos

## Liens utiles

- [Dépôt du projet](https://github.com/coopTilleuls/bikelib)
- [Gestionnaire de tâches](https://github.com/orgs/coopTilleuls/projects/28/views/2?filterQuery=)
- [Prototype](https://www.figma.com/file/91BAjXJqYT4Ecj12xECtlz/Untitled?node-id=336-484)

## Déploiement en production
- [via Kubernetes](./DEPLOY.md)
- [via Docker](./DEPLOY.md#sur-une-machine-virtuelle-en-utilisant-docker)

## URL du projet en local

- [Documentation de l'API (Swagger)](https://localhost/docs)
- [Frontend](https://localhost/)

## URL du projet déployé via la CD

La branche main est déployée sur [main.nonprod.bikelib.preprod-tilleuls.ovh](https://main.nonprod.bikelib.preprod-tilleuls.ovh)

Les PR sont déployées sur [pr-NN.nonprod.bikelib.preprod-tilleuls.ovh](https://pr-NN.nonprod.bikelib.preprod-tilleuls.ovh) (uniquement si le label deploy est ajouté sur la PR)

Les tags/releases sont déployées sur [demo.bikelib.preprod-tilleuls.ovh](https://demo.bikelib.preprod-tilleuls.ovh)

## Installation / utilisation du projet

```shell
git clone git@github.com:coopTilleuls/bikelib.git   # Clone du projet
cd bikelib              # Se place dans le dossier du projet
docker-compose build    # Installation du projet
docker-compose up -d    # Lance les containers
docker-compose exec php sh  # "Entrer" dans le container PHP
```

Temporairement, le site est protégé par un mot de passe : 
Login : Libre
Password : Rustine

## Pour générer la base de données

```shell
bin/console d:d:c           # Créer la BDD
bin/console d:m:m           # Lance les migrations
bin/console h:f:l -e dev    # Injecte les fixtures
```

## Pour exécuter l'intégralité des tests de l'API

```shell
bin/console d:d:d --env=test --force
bin/console d:d:c --env=test
bin/console d:m:m --env=test
bin/console h:f:l --env=test
php -d memory_limit=1024M vendor/bin/phpunit
```

## Pour lancer un test seul

```shell
vendor/bin/phpunit  <chemin/vers/votre/test>
```

## Pour lancer l'intégralité des tests end-to-end

```shell
cd ./pwa
pnpm playwright install
pnpm playwright test

# Pour avoir une interface graphique
pnpm playwright test --ui
```

## Pour obtenir un token JWT (JsonWebToken)

Faites une request POST sur cette URL : https://localhost/auth avec ce contenu

```
{
    "email": "clement@les-tilleuls.coop",
    "password": "Test1passwordOk!"
}
```

Permet d'obtenir le token suivant

```
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2Nzk2NTQxOTgsImV4cCI6MTY3OTY1Nzc5OCwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfVVNFUiJdLCJ1c2VybmFtZSI6ImNsZW1lbnRAbGVzLXRpbGxldWxzLmNvb3AifQ.OmmLYlmeriqt-SSIgseyTDDYcAOFs_ws4p7FmbBbExpPn3JQOyrIQk3zs-NKOIupxT8grB42KPnCa_cm08i6Mu1p4Bm-lBWe2N95rNCTRAhazFirwVCx5Jgkp1QD2ICUElOyw6pid8oroTQ903XhtHJnK8tRADArDZqz64U3p4eHcMbappjyJCQhVeV50oYsqcmR3gPWkO5uNt-9lMz4prOasz4rRPXY3MIVrGX6NJTCGkQjQPD0ibcqofJxoXpWmYvzIMNfRw7Wb0yd7guQxm7rWRVAwjBWFiW1eLou4upuq_KREojGLJwcTHVODeCrJcsQyRPtW1SRvrtP-PJ3tA"
}
```

Ensuite passer le token JWT en header à vos requêtes `Authorization: Bearer {token}`

## Pour l'envoi des emails

Par défaut dans ce projet nous utilisons symfony/mailer et mailgun pour envoyer nos emails.
Vous êtes libre d'implémenter une autre solution pour cette partie.

Vous avez juste à changer les variables d'environnement suivantes et installer la librairie
compatible avec symfony/mailer (gmail, amazon, mailchimp, mailjet etc...)

```
MAILER_SENDER
MAILER_DSN
```

Toute la documentation est disponible ici : https://symfony.com/doc/current/mailer.html

## Pour se connecter

En tant qu'admin

```
mail:       clement@les-tilleuls.coop
password:   Test1passwordOk!
```

En tant que boss d'une solution de réparation

```
mail:       boss@test.com
password:   Test1passwordOk!
```

Ou

```
mail:       boss2@test.com
password:   Test1passwordOk!
```

Pour se connecter en tant que cycliste

```
mail:       user1@test.com
password:   Test1passwordOk!
```

## Pour modifier le sitemap

Le sitemap.xml est disponible via la route suivante : `/sitemap.xml`

Côté front, dès que vous ajouter une nouvelle route disponible publiquement, c'est à dire sans authentification, il faut modifier le controller `SitemapController` présent côté back, afin que le sitemap soit mis à jour.

## Captcha

Le captcha est celui de Cloudflare : Turnstile.

Il suffit d'aller dans votre pwa/.env.local et d'y ajouter la variable présente dans pwa/.env tout en y mettant la sitekey dédiée présente sur notre compte Cloudflare Tilleuls à cette adresse :
https://dash.cloudflare.com/login


## Notifications
Le système de notifications push utilise [Firebase Cloud Messaging](https://firebase.google.com/), pour les faire fonctionner
il faut indiquer des credentials valides dans le .env (et fournies par FCM) et lancer la commande suivante

```
php bin/console app:firebase:credentials
```

Il est nécessaire d'utiliser un protocole HTTPS intégral. En environnement local si vous avez des erreurs
de tunnel SSL dans l'app react il est conseillé d'installer ngrok pour créer un tunnel vers l'application: 

```
ngrok http --host-header="localhost:443" localhost:443
```

L'IP ensuite proposée doit surcharger localhost dans le docker-compose.override :

```
  php:
    environment:
      TRUSTED_HOSTS: ^${SERVER_NAME:-example\.com|localhost|<votre ip ngrok>.ngrok-free.app}|caddy$$```

  pwa:
    environment:
      NEXT_PUBLIC_ENTRYPOINT: https://<votre ip ngrok>.ngrok-free.app
```

Et ajouter dans le .env.local de votre PWA 

```
NEXT_PUBLIC_ENTRYPOINT=https://<votre ip ngrok>.ngrok-free.app
```


## Usage du site

Une fois les containers lancés, le projet est disponible à l'adresse suivante :

```
https://localhost
```

Il existe 3 parcours sur le site : 

- Le parcours du cycliste "traditionnel" disponible à la racine du site
- Le parcours d'un réparateur de vélo, qui accède à l'URL /sradmin sur laquelle il peut gérer ses clients, rendez-vous, horaires..
- Le parcours d'un administrateur du site, qui accède à l'URL /admin, sur laquelle il peut accepter les demandes des réparateurs, consulter les messages reçus...

La gestion du carnet d'entretien d'un vélo peut se faire via l'URL /mes-velos du parcours cycliste, il y est possible
d'y ajouter des photos ou des factures à différents formats :
- photos : .png, .jpg, .jpeg
- factures : .pdf, .doc, .docx, .odt, .xls, .csv, .png, .jpg, .jpeg

Les réparateurs peuvent également accéder à ce carnet et ajouter des interventions dont ils sont à l'origine.

## Rôles

Les utilisateurs du site sont répartis dans 4 rôles différents : 

- <b>ROLE_USER</b>, il s'agit des utilisateurs de la plateforme
- <b>ROLE_BOSS</b>, il s'agit des propriétaires des solutions de réparation
- <b>ROLE_EMPLOYEE</b>, il s'agit des employés des solutions de réparation
- <b>ROLE_ADMIN</b>, il s'agit des administrateurs de la plateforme


## Mise à jour des créneaux disponibles et des rendez-vous

Une tâche CRON doit être joué toutes les 30min pour mettre à jour le prermier créneau disponible de chaque réparateur (lorsqu'il n'est pas déjà actualisé*)

```
php bin/console app:repairer:update-first-slot-available
```

Une autre commande (facultative) permet de mettre à jour le status des rendez vous lorsque ces derniers n'ont pas obtenu de réponse depuis 72 heures ou que leur date est dépassée. Elle peut également être jouée quotidiennement :


```
php bin/console app:appointments:cancel-old
```
