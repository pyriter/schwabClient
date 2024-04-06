#!/usr/local/bin/node

const fs = require("fs");

const fileName = "credentials.json";
const url = process.argv[2];

const urlParamString = url.split("?")[1];
const paramsKeyValue = urlParamString.split("&");
const paramsMap = {};

paramsKeyValue.forEach(str => {
  const [key, value] = str.split("=");
  paramsMap[key] = value;
});

const credentials = fetch();
const updatedCredentials = {
  ...credentials,
  code: decodeURIComponent(paramsMap["code"]),
  sessionId: decodeURIComponent(paramsMap["session"])
};
update(updatedCredentials);
console.log(updatedCredentials);

function update(tdaCredential) {
  fs.writeFileSync(fileName, JSON.stringify(tdaCredential, null, 2), "utf8");
}

function fetch() {
  const credential = JSON.parse(fs.readFileSync(fileName, "utf8"));
  if (!credential) {
    throw new Error(
      "You need to create the test credential file if you want to run the tests. Check out the README.md file"
    );
  }
  return credential;
}
