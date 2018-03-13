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
    colorMap['stopped'] = '#DAA038';
    colorMap['succeeded'] = '#34A64F';
    colorMap['failed'] = '#A30300';
    colorMap['canceled'] = '#666666';
    colorMap['partiallySucceeded'] = '#DAA038';
    colorMap['fallback'] = '#4C7AA1';

    var statusMap = {};
    statusMap['stopped'] = 'has been canceled';
    statusMap['succeeded'] = 'succeeded';
    statusMap['failed'] = 'failed';
    statusMap['canceled'] = 'canceled';
    statusMap['partiallySucceeded'] = 'partially succeeded';
    statusMap['fallback'] = 'finished';

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
            var buildNumber = req.body.resource.buildNumber;
            var status = (req.body.resource.status in colorMap) ? req.body.resource.status : 'fallback';
            var link = req.body.resourceContainers.account.baseUrl + "_permalink/_build/index?collectionId=" + req.body.resourceContainers.collection.id + "&projectId=" + req.body.resourceContainers.project.id + "&buildId=" + req.body.resource.id;
            var color = colorMap[status];
            var pretext = "Build <" + link + "|" + buildNumber + "> " + statusMap[status];
            var fallback = "Build " + statusMap[status];

            var slack = {
                username: username,
                icon_url: icon,
                attachments: [{
                    color: color,
                    pretext: pretext,
                    mrkdwn_in: [
                        "pretext"
                    ],
                    fallback: fallback,
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