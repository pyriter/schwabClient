# Charles Schwab Client for Nodejs

[![Patreon](https://img.shields.io/badge/Patreon-F96854?style=for-the-badge&logo=patreon&logoColor=white)](https://www.patreon.com/Pyriter)

## Overview

A Javascript client for the Charles Schwab Restful API written in Typescript for NodeJs.

## Features

1. Auto fetch refresh token when access token expires.
2. Credentials can be fetched and stored using these providers
    1. Local cache
    2. Local file
    3. Customizable (e.g. connect to datastore such as S3 or DynamoDB)
3. Get user account information
4. Get watchlist
5. Get option chain
6. Get quote
7. Manage orders
8. Get transactions
9. Get market hours
10. Get price history
11. Place/Replace order

## Install

```bash
$ npm install @pyriter/schwab-client
```

## Getting an Access Token

To gain access to the Schwab (TDA) APIs, you will need to get an access token from your trading account.

## How to use it

### Instantiate the SchwabClient object

At the bare minimum, you will need to provide an access token and client id and client secret in order to instantiate the schwabClient.

### Development setup for running tests

1. Create a credentials.json file at the package root level with the following information:
```json
{
  "client_id": "",
  "client_secret": "",
  "redirect_uri": "http://localhost/"
}
```
2. Run the script to generate the login url
```bash
node ./generateAuthUrl.js
```
3. Open the url provided from the output of step #2 in a browser and login to Schwab.
4. After logging in and agreeing to the terms. You will then get to a redirect to `localhost` with the code as part of the query params. Copy this url link in its entirety.
5. Within the terminal run the script to generate the auth token
```bash
node ./extractAuthCode.js [paste-your-url-from-step-4-here]
```
6. Run the tests
```bash
npm tests
```
### Publishing to npm

This command will update the package version and then publish to the public npm repo

```bash
$ npm version [patch | minor major]
$ npm publish
```

## Appendix


## License

Schwab Client is [MIT licensed](./LICENSE).
