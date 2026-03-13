# Deploy

The github action that deploys connects using SSH to my server and runs
this script saved to `~/.deploy/deploy_groceries.sh`:

```bash
#!/usr/bin/bash

podman pull ghcr.io/jasongoemaat/groceries:latest

podman run -d --replace --name groceries -p 3004:8090 \
    -e POCKETBASE_ENCRYPTION_KEY=XXXXXXXXXXXXXX \
    -e POCKETBASE_ADMIN_EMAIL=XXXXXXXXXXXXXX \
    -e POCKETBASE_ADMIN_PASSWORD=XXXXXXXXXXXXXX \
    -v groceries_data:/pocketbase/data:U \
    -v groceries_migrations:/pocketbase/migrations:U \
    ghcr.io/jasongoemaat/groceries:latest
```

This uses the public, hooks, and scripts directories from building the docker
image, but maps 'data' and 'migrations' to directories in my home directory:

    ~/.local/shared/containers/storage/volumes/groceries_data/_data
    ~/.local/shared/containers/storage/volumes/groceries_migrations/_data

The ':U' option on each volume mounts as the 'pocketbase' user, this is
needed at least for creating collections snapshot.  The '-i' is needed for
interactivity because the command prompts you:

    podman exec -t -i  groceries /pocketbase/scripts/pb.sh migrate collections

To copy the contents of `/pocketbase/migrations` locally, I go to the
`pocketbase/migrations` folder in this repository and run this:

    scp myuser@myserver:.local/share/containers/storage/volumes/groceries_migrations/_data/* .

You can also export and import the schema using the admin ui at `/_/`.
The schema for my two collections 'lists' and 'listItems' are exported
in [pb_schema.json](pb_schema.json)
