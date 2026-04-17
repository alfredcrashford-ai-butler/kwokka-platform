# pawsome-elements-backend

## Stack

* Node.js - `v22`
* Docker - `v20`

## Env variables

* `NODE_ENV` - environment, always `production` for prod builds.
* `PORT` - port for http server.
* `APP_NAME` - name of the app, used in logging and tracing.
* `LOG_LEVEL` - level of logs.
* `KWOKKA_ENDPOINT` - host of kwokka platform api (i.e. `https://api.kwokka.co`).
* `KWOKKA_CLIENT_ID` - the id of the client, used for authentication in kwokka platform
* `KWOKKA_SECRET` - the secret, used for authentication in kwokka platform
* `SENTRY_DSN` - sentry dsn, can be obtained in the sentry dashboard
* `GAME_SERVER_HOST` - the host of game server (i.e. `https://api.pawsome-elements.com`).
* `GAME_SERVER_PATH` - the path to game server (i.e. `/v1/game`).

## Local development

Run the following command to start local server:

```sh
npm run start
```

## Setup production deployment

The whole thing runs on Hetzner cloud. How to set up a blank server:

1. Add the **A** DNS record to the domain manager with Name: `api.pawsome-elements.com`; and Value: `188.245.204.35` (IP of virtual machine in Hetzner cloud)
2. Connect via ssh to hetzner cloud virtual machine: `ssh root@188.245.204.35`.
3. Create pwsm user ([ref](https://www.baeldung.com/linux/ssh-new-user)):
```sh
adduser pwsm
```
4. Disconnect as `root` and connect again as `pwsm`: `ssh pwsm@188.245.204.35`.
5. [Generate SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) and add it to the github
6. Clone this repository and navigate to it:
```sh
git clone git@github.com:kwokka/pawsome-elements-backend.git
cd pawsome-elements-backend
```
7. Make sure docker is installed and `pwsm` user has access to use it. If not, install docker and provide access:
```sh
su
chmod 666 /var/run/docker.sock
```

That's it! You should be all set up to this moment! To deploy to production - use CI.
