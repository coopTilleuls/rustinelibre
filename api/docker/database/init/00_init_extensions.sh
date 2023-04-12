#!/bin/sh
# create extension must run as admin
export PGPASSWORD=$POSTGRES_POSTGRES_PASSWORD
psql -U postgres -d $POSTGRES_DB -c "create extension if not exists postgis;"