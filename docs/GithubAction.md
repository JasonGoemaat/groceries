## Github Action

There is a github action in `.github/workflows/build-deploy.yml` that will
build the app and docker image and deploy it to my server.   For this to work
for you, you should have a server setup and a user that can run podman with
the ability to SSH to that server using a private key.

You then need to configure these secrets.  I've added the filespec `**/*.secret`
to both `.gitignore` and `.dockerignore` so that I can create files with these
locally for easy access and not have them show up in github or in my docker
layers/images.

See: [docs/github_variables](docs/github_variables)

* `GITHUB_TOKEN` - Created by github, used in workflow
* `SSH_HOST` - hostname to publish docker image on
* `SSH_PORT` - port to connect to host with SSH
* `SSH_USER` - user for connecting to ssh
* `SSH_PRIVATE_KEY` - private key (i.e. contents of `.ssh/id_rsa`)
