# Dev

## Against local PocketBase

Start my pre-built image running on 127.0.0.1:8123

    docker run -d -t -p 127.0.0.1:8123:8090 --name groceries ghcr.io/jasongoemaat/groceries:latest

Look at log and go to the url given, changing '0.0.0.0:8090' to
'127.0.0.1:8123'.  This will let you create an admin user.  You can then use
the admin console at: http://127.0.0.1:8123/_/ if you wish but shouldn't need
to.

Install dependencies and start in the 'development' environment:

    npm i
    npm start

If you wish to use your own pocketbase server you will need to setup the
schema with the 'items' and 'listItems' tables, which you can do by importing
[/docs/pb_schema.json](pb_schema.json).

## Local dev against server

If you have setup the PocketBase server with the 'lists' and 'listItems'
tables somewhere else, copy the `/src/environments/environment.development.ts`
file to `/src/environments/environment.local.ts` and change the name to 'local'
and the `POCKETBASE_URL` and `SHARE_BASE_URL` values to the url where
the server is running is running without the path:

```js
export const environment = {
    name: 'local',
    production: false,
    POCKETBASE_URL: "https://groceries.example.com",
    SHARE_BASE_URL: "https://groceries.example.com",
};
```

Then install dependencies and start with the 'local' configuration using the
'local' script:

    npm i
    npm run local

## Run inside reverse proxy

If you have the pocketbase container running on a remote server using nginx,
you can change the configuration to proxy calls to your local machine under
the '/dev' path.  As an example if my server is running on
`https://groceries.example.com`, I can add this location to my nginx config
for the site assuming my development machine's IP on the same network
is 10.0.100.33:

```
location /dev/ {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass "http://10.0.100.33:4200/dev/";
}
```

Then install dependencies and run the 'proxy' script:

    npm i
    npm run proxy

Then when you visit `https://groceries.example.com/dev/`, the nginx server will
proxy those request to `http://10.0.100.33:4200/dev/`.   The proxy script
uses the 'proxy' angular configuration and uses the `--host 0.0.0.0` argument
to listen on all IP addresses on your dev machine and the
`--serve-path /dev/` argument to tell the server what the base path is.
The proxy configuration replaces the normal `/src/index.html` file with
`/src/index.proxy.html` which includes this change in the header:

```html
<base href="/dev/">
```





