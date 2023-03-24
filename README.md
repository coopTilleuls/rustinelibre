
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

## Lors du changement de branche
Des dépendances ont pu être modifées et des migrations ajoutées
``` shell
composer install
bin/console d:m:m  
```


