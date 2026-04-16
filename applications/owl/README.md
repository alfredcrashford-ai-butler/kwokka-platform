# @kwokka/owl

AuthN & AuthZ service in kwokka platform.

## Stack

* Node.js - `v22`
* Docker - `v20`
* Mongo - `v5`

## Env variables

> TODO: add list of env variables

## Tech details

### Oauth2 with discord

The Oauth2 with discord is working using the following algorithm:

1. A client redirects to discord authorize url with `client_id` and `redirect_uri` embeded in the url.
2. A user authorizes with their discord account.
3. After this the user is redirected back to the client with `accessToken` embeded in the url.
4. The client then sends the sign-in / sign-up request to the server including `accessToken`.
5. When server receives the request, it uses the `accessToken` to retrieve user info from discord.
6. With this user info server creates new account, issues credentials, and tokens.

#### Prerequisites

* Set up the discord application in discord dev portal.
* Provide client id to client.

#### Links

* [Dev Discord Console](https://discord.com/developers/applications/1109571176860229693/oauth2)
* [Prod Discord Console](https://discord.com/developers/applications/1264557950194815099/oauth2)
* [User resource](https://discord.com/developers/docs/resources/user)
* [Quick Tutorial for Oauth2](https://discord.com/developers/docs/topics/oauth2#implicit-grant)

### Oauth2 with google

The Oauth2 with google is working using the following algorithm:

1. A client with use of GSI library connects to google and requests for `accessToken`.
2. A popup from GSI library opens in a new tab, user selects google account and authorizes.
3. The popup closes and GSI library invokes callback function with `accessToken` as an argument.
4. The client then sends the sign-in / sign-up request to the server including `accessToken`.
5. When server receives the request, it uses the `accessToken` to retrieve user info from google.
6. With this user info server creates new account, issues credentials, and tokens.

#### Prerequisites

* Set up the oauth consent screen and credentials using google console
* Provide client id both to client and server.

#### Links
* [Google console](https://console.cloud.google.com/apis/credentials)
* [JS library API reference](https://developers.google.com/identity/oauth2/web/reference/js-reference)
* [Set up client id](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid#get_your_google_api_client_id)
