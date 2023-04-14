
# Bikelib

Plateforme de mise en relation avec des réparateurs de vélos

## Liens utiles

- [Dépôt du projet](https://github.com/coopTilleuls/bikelib)
- [Gestionnaire de tâches](https://github.com/orgs/coopTilleuls/projects/28/views/2?filterQuery=)
- [Prototype](https://www.figma.com/file/91BAjXJqYT4Ecj12xECtlz/Untitled?node-id=336-484)


## URL du projet en local
- [Documentation de l'API (Swagger)](https://localhost/docs)
- [Frontend](https://localhost/)

## Installation / utilisation du projet

``` shell
git clone git@github.com:coopTilleuls/bikelib.git   # Clone du projet
cd bikelib              # Se place dans le dossier du projet
docker-compose build    # Installation du projet
docker-compose up -d    # Lance les containers
docker-compose exec php sh  # "Entrer" dans le container PHP
```

## Pour générer la base de données
``` shell
bin/console d:d:c           # Créer la BDD
bin/console d:m:m           # Lance les migrations
bin/console h:f:l           # Injecte les fixtures
```

## Pour exécuter les tests
``` shell
bin/phpunit             # Lance les tests API
```


## Pour obtenir un token JWT (JsonWebToken)
Make a POST request on URL : https://localhost/auth with body
```
{
    "email": "clement@les-tilleuls.coop", 
    "password": "test"
}
```

To obtain the following token
```
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2Nzk2NTQxOTgsImV4cCI6MTY3OTY1Nzc5OCwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfVVNFUiJdLCJ1c2VybmFtZSI6ImNsZW1lbnRAbGVzLXRpbGxldWxzLmNvb3AifQ.OmmLYlmeriqt-SSIgseyTDDYcAOFs_ws4p7FmbBbExpPn3JQOyrIQk3zs-NKOIupxT8grB42KPnCa_cm08i6Mu1p4Bm-lBWe2N95rNCTRAhazFirwVCx5Jgkp1QD2ICUElOyw6pid8oroTQ903XhtHJnK8tRADArDZqz64U3p4eHcMbappjyJCQhVeV50oYsqcmR3gPWkO5uNt-9lMz4prOasz4rRPXY3MIVrGX6NJTCGkQjQPD0ibcqofJxoXpWmYvzIMNfRw7Wb0yd7guQxm7rWRVAwjBWFiW1eLou4upuq_KREojGLJwcTHVODeCrJcsQyRPtW1SRvrtP-PJ3tA"
}
```

Then pass the JWT on your request's header as  `Authorization: Bearer {token}`


## Pour l'envoi des emails
By default in this project we use symfony/mailer and mailgun to send our emails. 
You are free to implement another solution for this task.

You just have to change the following environment variables, and install the library compatible with symfony/mailer 
(gmail, amazon, mailchimp, mailjet etc...)

```
MAILER_SENDER
MAILER_DSN
```

All the documentation is available here : https://symfony.com/doc/current/mailer.html
