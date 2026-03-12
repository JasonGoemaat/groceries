# PocketBase

## podman storage

I create a podman volume and inspect it:

    podman volume create groceries
    podman volume inspect groceries

Looking at the JSON I see its under my home directory, nice that podman doesn't
require root:

    /home/jason/.local/share/containers/storage/volumes/groceries/_data

So that is the directory I'll have to backup to save anything if I want
to move it.   That will be the main working directory `/pocketbase` that is
the default for the docker image I'll be using.   In it are subdirectories
for 'data', 'migrations' (database schema so you can wipe the data and
start fresh), 'public' (where html files are served, where my app goes), and
'hooks' (JS app hooks?  will have to check those out).

> NOTE: Pocketbase will create the public and migration directories.   I can
create the 'public' and 'hooks' directories with my own user.   I do however
have to pass the ':z' option when running the container due to some SELinux
protection I gather.   

## Main Image

I think I'll go with the [adrianmusante/pocketbase image](https://hub.docker.com/r/adrianmusante/pocketbase).
For that I will set these variables:

* `POCKETBASE_ENCRYPTION_KEY` - set to a 32 character string to encrypt
    settings saved in pocketbase in case the data files are stolen.   This
    protects things like my secrets for google authentication, etc.
* `POCKETBASE_ADMIN_EMAIL` and `POCKETBASE_ADMIN_PASSWORD`

These are in the [.secrets](.secrets) file in this directory on my computer
right now, but are ignored by git.  These values are also in my KeePass
file.

## Running

Actual command with values is in my [.secrets](.secrets) file.   This uses
the volume I setup above, maps podman to host port 3003 so nginx can access it,
sets up an encryption key for database settings, and sets up my admin
user.   Note the ':z' on the '-v' option, I needed this so podman could access
the 'public' directory I created for my files.

```
podman run -d --replace --name groceries -p 3003:8090 \
    -e POCKETBASE_ENCRYPTION_KEY=XXX \
    -e POCKETBASE_ADMIN_EMAIL=XXX \
    -e POCKETBASE_ADMIN_PASSWORD=XXX \
    -v groceries:/pocketbase:z \
    adrianmusante/pocketbase:latest
```

## Migrations

I've now setup a 'dockerfile' to build the app and publish it to
'/pocketbase/public', and to copy the 'migrations' and 'hooks' directories to
'/pocketbase' in the generated image.  The image can then be run with
pocketbase running the app.

To allow executing commands easily with environment variables like they were
setup with the source image, I created a 'scripts' directory that ends up
as `/pocketbase/scripts` and a `pb.sh` script you can run like so, this command
'migrate collections' should produce a single migration file with all changes,
though in practice I think it lacked the security rules I had added.  Also then
you should run with 'history-sync' to remove missing migrations from the
database, and restart the server.

```
podman exec -t -i --name groceries \
    -e POCKETBASE_ENCRYPTION_KEY=XXX \
    -e POCKETBASE_ADMIN_EMAIL=XXX \
    -e POCKETBASE_ADMIN_PASSWORD=XXX \
    -v groceries:/pocketbase:z \
    /pocketbase/scripts/pb.sh migrate collections
```

