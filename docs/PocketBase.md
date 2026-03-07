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
'hooks' (JS app hooks?  will have to check those out)

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

Actual command with values is in my [.secrets](.secrets) file.

```
podman run -d --name groceries -p 3003:8090 \
    -e POCKETBASE_ENCRYPTION_KEY=XXX \
    -e POCKETBASE_ADMIN_EMAIL=XXX \
    -e POCKETBASE_ADMIN_PASSWORD=XXX \
    -v groceries:/pocketbase \
    adrianmusante/pocketbase:latest
```
