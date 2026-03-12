# Groceries


## Quickstart

Start my image pre-built image locally

    docker run -d -t -p 127.0.0.1:8123:8090 --name groceries ghcr.io/jasongoemaat/groceries:latest

Look at log and go to the url given, changing '0.0.0.0:8090' to
'127.0.0.1:8123'.  This will let you create an admin user.   Then you
can use the admin console at: http://127.0.0.1:8123/_/

    docker logs groceries

You can just use the app with the latest code by going to http://127.0.0.1:8123

Running in development mode is setup to use this url in
`/src/environments/environment.development.ts`, so just you can just
install dependencies and start:

    npm i
    npm start

> TODO: add '-v' option to example to mount local 'migrations' folder so you
can update collections using the admin UI and it will update the code.
    
## Build Your Own Docker Image:

1. Run `docker build . -t my-groceries`
2. Run `docker run -p 127.0.0.1:8123:8090 --name groceries1 my-groceries`
3. Run `docker logs groceries1`
4. Visit the displayed url, changing `0.0.0.0:8090` to `127.0.0.1:8123` to
    setup an admin user.

In the future you can start and stop the container:

    docker stop groceries1
    docker start groceries1

## Custom Server

For developing locally against a different server I created a 'local'
angular environment.

The file `src/environments/environment.local.ts` is ignored by source control,
so create that file and copy the contents of the development version and
change the POCKETBASE_URL.   Then run with this command to use that:

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
