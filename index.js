var request = require('request');
require('dotenv').config();

var DocumentDBClient = require('documentdb').DocumentClient;

var databaseId = "jibe";
var collectionId = "slackers";

var host = process.env.DB_HOST;
var key = process.env.DB_KEY;
var client = new DocumentDBClient(host, { masterKey: key });

module.exports = function (context, req) {

    context.log(req)

    var docId = req.query.key;
    var dbLink = 'dbs/' + databaseId;
    var collLink = dbLink + '/colls/' + collectionId;
    var docLink = collLink + '/docs/' + docId;

    var colorMap = {};
    colorMap['stopped'] = "#DAA038";
    colorMap['succeeded'] = '#34A64F';

    client.readDocument(docLink, function (err, doc) {
        if (err) {
            context.log(err);
            context.res = { status: 400, body: { message: 'Invalid key!' } };
            context.done();
        } else {
            context.log(doc);

            const hook = doc.slack;
            var username = doc.username;
            var icon = doc.icon;
            var requestedBy = req.body.resource.requests[0].requestedFor.displayName;
            var buildDefinition = req.body.resource.definition.name;
            var status = req.body.resource.status
            var link = req.body.resourceContainers.account.baseUrl + "_permalink/_build/index?collectionId=" + req.body.resourceContainers.collection.id + "&projectId=" + req.body.resourceContainers.project.id + "&buildId=" + req.body.resource.id;

            var slack = {
                username: username,
                icon_url: icon,
                attachments: [{
                    color: "#36a64f",
                    pretext: "<" + link + "|Build>",
                    mrkdwn_in: [
                        "pretext"
                    ],
                    fallback: "Build",
                    fields: [{
                        title: "Requested by",
                        value: requestedBy,
                        short: true
                    }, {
                        title: "Build Definition",
                        value: buildDefinition,
                        short: true
                    }]
                }]
            }

            // log slack message
            context.log(JSON.stringify(slack))

            request.post({
                url: hook,
                headers: {
                    "Content-Type": "application/json"
                },
                body: slack,
                json: true
            }, function (error, response, body) {
                context.log(error);
                context.log(JSON.stringify(response));
                context.log(body);
                context.done();
            });
        }
    });
};