#!/usr/local/bin/node

const credentials = require("./credentials.json");

const redirectUrlFormEncoded = encodeURIComponent(credentials.redirect_uri);
const clientIdUrlFormEncoded = encodeURIComponent(credentials.client_id);
console.log(`https://api.schwabapi.com/v1/oauth/authorize?client_id=${credentials.client_id}&redirect_uri=${credentials.redirect_uri}`);
