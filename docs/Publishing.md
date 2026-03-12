# Publishing

I think I'll run the app at https://groceries.goemaat.com and run it in a
single docker container.   The image will contain pocketbase along with
the built UI front-end.

## Domain

I added the CNAME record for 'groceries' on
[godaddy](https://dcc.godaddy.com/control/portfolio/goemaat.com/settings?tab=dns&itc=mya_vh_buildwebsite_domain):

I had already setup nginx on my fedora MiniPC, but here's a quick recap of
commands I used to install nginx and set it up so it can accept incoming
HTTP and HTTPS connections and connect externally so that I can port-forward
to my dev machine if needed

    sudo dnf install nginx
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    sudo firewall-cmd --reload
    sudo setsebool -P httpd_can_network_connect 1
    sudo systemctl enable --now nginx

And create a place to host files along with a simple index.html for testing,
then configure the groceries.goemaat.com domain:

    sudo mkdir /var/www/groceries.goemaat.com
    sudo nano /etc/nginx/conf.d/groceries.goemaat.com.conf

Contents of `groceries.goemaat.com.conf`:

```
server {
    listen 80;
    listen [::]:80;
    server_name groceries.goemaat.com;
    root /var/www/groceries.goemaat.com;
    index index.html index.csr.html;
}
```

Then ran certbot and followed instructions to get a LetsEncrypt SSL cert, using
snap for some reason (following [this page](https://www.linode.com/docs/guides/enabling-https-using-certbot-with-nginx-on-fedora/))

    sudo dnf install snapd
    sudo snap install --classic certbot
    sudo certbot --nginx

That altered my nginx config to redirect HTTP to HTTPS and added the
config options to use the certificate.

## Reverse proxy NGINX

Along with changing my base config to serve files as a reverse proxy,
I use [this page](https://pocketbase.io/docs/going-to-production/#using-reverse-proxy)
from pocketbase.io as a reference to set proxy headers.   This is what I have
now in `/etc/nginx/conf.d/groceries.goemaat.com.conf`:

```
server {
    server_name groceries.goemaat.com;
    client_max_body_size 10M;

    location / {
        # check http://nginx.org/en/docs/http/ngx_http_upstream_module.html#keepalive
        proxy_set_header Connection '';
        proxy_http_version 1.1;
        proxy_read_timeout 360s;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # enable if you are serving under a subpath location
        #
        # note that it is better to use a subdomain when possible because of
        # the same-origin isolation for localStorage and other resources
        # rewrite /yourSubpath/(.*) /$1  break;

        proxy_pass http://127.0.0.1:3003;
    }


    listen 443 ssl; # managed by Certbot
    listen [::]:443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/goemaat.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/goemaat.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = groceries.goemaat.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    listen [::]:80;
    server_name groceries.goemaat.com;
    return 404; # managed by Certbot
}
```

