# Angular

## Environment

To setup angular environments (`/src/environments`) I ran:

    ng g environments

I'm not sure exactly how to use these or even how I want to use them.   The
only real configuration I might want to change is the URL for the PocketBase
server.   I'm setting it up to build and create a docker image with the
distributed code running inside a PocketBase container.   For development
I want to specify a server instead.

For deployment I thought I might want to allow specifying that in a
variable for the github action however.   I think I could use the `envsubst`
command with those files prior to build, for example `/env_template.js`

```js
export const environment = {
    POCKETBASE_URL: "${POCKETBASE_URL}"
};
```

Then the build could run (maybe using different file for template):

    envsubst < ./env_template > ./src/environments/environment.production.ts

That should take the template, replace `${POCKETBASE_URL}` with whatever
that environment variable is set as in the build process, and save it as
the production environment file prior to building for production.

