'use strict';
var AWS = require('aws-sdk'), region = "us-west-2", secretName = "arn:aws:secretsmanager:<Region>:<AccountId>:secret:SecretName-6RandomCharacters", secret;
var client = new AWS.SecretsManager({region: region});


exports.handler = (event, context, callback) => {
  var response;

  client.getSecretValue({SecretId: secretName}, function(err, data) {
    if (err) {throw err}
    else {
      secret = JSON.parse(data.SecretString);
    }

    //ServerId is stored in Secrets Manager
    if (secret.serverId !== "") {
      //Once secrets are fetched, we compare username and password entered with the ones available in secrets.
      if (event.username === secret[event.username + ".USERNAME"]) {
        if (event.password === secret[event.username + ".PASSWORD"]) {
        //HomeDirectory is the S3 bucket name + subfolder where the files will be pushed. For example, /S3FTP/striker
        //Role is also stored in secrets
          response = {
            Role: secret.role,
            HomeDirectoryType: "LOGICAL",
            HomeDirectoryDetails: JSON.stringify([{"Entry": "/" + secret[event.username + ".USERNAME"], "Target": secret.home + secret[event.username + ".USERNAME"]}])
          };
        } else {
          response = {}
        }
      } else {
        response = {}
      }
    } else {
      response = {};
    }

    console.log("Response:", JSON.stringify(response));
    callback(null, response);
  });
};
