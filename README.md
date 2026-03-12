# Groceries

## Pre-built Image Quickstart:

First run my container on port 8123 of your computer:

    docker run -d -p8123:8090 --name groceries1 jasongoemaat/groceries:latest

Now run a command to create the admin user

    docker exec -t -i groceries1 /pocketbase/scripts/pb superuser upsert "[email]" "[password]""

Alternatively you can run the image the first time with the '-t' added after
'-d' and use the link provided changing `0.0.0.0:8090` to `localhost:8123` to
create the first admin user in your browser.

## Build Your Own Docker Image:

1. Run `docker build . -t my-groceries`
    * the `-t my-groceries` option gives it a tag of 'my-groceries'
2. Run `docker run -t -p8123:8090 --name groceries1 my-groceries`
    * the `--name groceries1` option names the new container, otherwise docker
        will give it a funny name and you will have to use that or the hash
        to manage it.

This will expose the app on your computer on port 8123.  The '-t' will give it
a 'tty' so it displays output.   Copy the link it displays and change the
host and port from `0.0.0.0:8090` to `localhost:8123`.   This will open a page
for you to create an admin login with the user and password you provide and
show you the dashboard where you can manage the server.

In the future you can start and stop the container:

    docker stop groceries1
    docker start groceries1

## Environments

Building in production uses the PocketBase url '/' (specified in
`src/environments/environment.production.ts`) as the app is meant to be
run by building the docker image and service the app through the PocketBase
'public' directory.

Running in development uses the PocketBase url 'http://localhost:8090', the
default when you run pocketbase on your local machine.  When running this way,
you should copy the contents of the 'migrations' directory to where pocketbase
can access them to create the database structure.

I added a 'local' environment and added 
`src/environments/environment.local.ts` to `.gitignore` so you can create that
file with the contents from `environment.development.ts` and change the url
to choose a different dev server without messing with source control.
    
    npm start -- --configuration=local

I also added a script for it directly:

    npm run local

## Migrations

You should copy the files from the pocketbase 'migrations' folder where
the app runs to the 'pocketase/migrations' folder here so that future installs
will have any changes you make with the admin UI.

For me, I run on my box called 'fedora' as my user 'jason'.   The container
is running on podman with a mapped volume for the data.   This is the command
I use to copy the contents of the migration file from my server to the
local directory:

    PS C:\git\goemaat.com\groceries\pocketbase\migrations>
    scp jason@fedora:.local/share/containers/storage/volumes/groceries/_data/migrations/* .

## Other Pages:

* [GithubAction](docs/GithubAction.md) - Explains the github action and how
    to setup variables to deploy to your own server using SSH and the
    github container registry (ghcr.io)


