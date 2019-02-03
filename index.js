var request = require('request');
require('dotenv').config();

var DocumentDBClient = require('documentdb').DocumentClient;

var databaseId = "jibe";
var collectionId = "slackers";

var host = process.env.DB_HOST;
var key = process.env.DB_KEY;
var vstsAuth = process.env.VSTS_AUTH;
var client = new DocumentDBClient(host, { masterKey: key });

module.exports = function (context, req) {

    context.log(req);

    var docId = req.query.key;

    if (docId == 'ping') {
        context.res = { status: 200, body: { message: 'pong!' } };
        context.done();
        return;
    }

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
    statusMap['stopped'] = 'canceled';
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

            // read team document
            var requestedBy = req.body.resource.requests[0].requestedFor.displayName.toLowerCase();
            var team = doc.team;
            var teamDocLink = collLink + '/docs/' + team;
            client.readDocument(teamDocLink, function (err, teamDoc) {
                if (err) {
                    context.log(err);
                    context.res = { status: 400, body: { message: 'Invalid team!' } };
                    context.done();
                    return;
                }

                // find user id
                var user = teamDoc.members.find(function(member) {
                    return (member.name === requestedBy);
                });

                var userId = requestedBy
                if (user) {
                    userId = "<@" + user.id + ">";
                }

                context.log("user id: " + userId);

                const hook = doc.slack;
                var username = doc.username;
                var icon = doc.icon;
                var repo = doc.repo;
                var channel = doc.channel;
                
                // var userId = req.body.resource.requests[0].requestedFor.uniqueName;
                var buildDefinition = req.body.resource.definition.name;
                var buildNumber = req.body.resource.buildNumber;
                var status = (req.body.resource.status in colorMap) ? req.body.resource.status : 'fallback';
                var baseUrl = req.body.resourceContainers.account.baseUrl;
                var projectId = req.body.resourceContainers.project.id;
                var buildUrl = baseUrl + "_permalink/_build/index?collectionId=" + req.body.resourceContainers.collection.id + "&projectId=" + projectId + "&buildId=" + req.body.resource.id;
                var color = colorMap[status];
                var sourceParts = req.body.resource.sourceGetVersion.split(':');
                var ref = sourceParts[1];
                var branch = ref.slice("refs/heads/".length);
                var commit = sourceParts[2];
                var buildLink = "<" + buildUrl + "|" + buildNumber + ">";
                var pretext = statusMap[status] + ": " + buildLink + " - " + userId;
                var fallback = statusMap[status] + ": " + branch + " - " + userId;
                var commitUrl = baseUrl + projectId + "/_git/" + repo + "/commit/" + commit + "?refName=" + ref;
                var branchUrl = baseUrl + projectId + "/_git/" + repo + "?version=GB" + branch + "&_a=history";

                // get commit info
                // if (docId === 'NULL-REFERENCE') {
                //     context.log("----- null-reference -----")
                //     context.done();
                //     return;
                // }
                
                var commitInfoUrl = baseUrl + projectId + '/_apis/git/repositories/' + repo + '/commits/' + commit;
                context.log("commit info url: " + commitInfoUrl);

                request.get({
                    url: commitInfoUrl,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Basic " + vstsAuth
                    },
                }, function (error, response, body) {
                    if (error) {
                        context.log("commit info (error): " + error);
                        context.res = { status: 400, body: { message: 'Error retrieving commit details!' } };
                        context.done();
                        return;
                    }

                    // log
                    context.log("commit info (response): " + JSON.stringify(response));
                    context.log("commit info (body): " + body);

                    var details = "";
                    if (response.statusCode !== 404) {

                        // process commit comment
                        var commitInfo = JSON.parse(body);
                        var comment = commitInfo.comment;
                        context.log("commit comment: " + comment);

                        var lines = comment.split('\n').filter(Boolean);

                        var msg = lines[0];
                        for (i = 1; i < lines.length; i++) {
                            var piece = lines[i];

                            // check for key:user
                            var parts = piece.split(':');
                            if (parts.length == 2) {
                                
                                // find user id
                                var p = teamDoc.members.find(function(member) {
                                    return (member.email === parts[1].toLowerCase());
                                });

                                piece = parts[0] + ": "
                                if (p) {
                                    piece = piece + "<@" + p.id + ">";
                                } else {
                                    piece = piece + parts[1];
                                }
                            }

                            msg += "\n" + piece;
                        }

                        details = "\n" + "```" + msg + "```"
                    }

                    var slack = {
                        channel: channel,
                        username: username,
                        icon_url: icon,
                        attachments: [{
                            color: color,
                            fallback: fallback,
                            fields: [],
                            text: pretext + details,
                            actions: [{
                                type: "button",
                                text: branch,
                                url: branchUrl
                            }, {
                                type: "button",
                                text: commit.slice(0, 7),
                                url: commitUrl
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
                        context.log("slack (error): " + error);
                        context.log("slack (response): " + JSON.stringify(response));
                        context.log("slack (body): " + body);
                        context.done();
                    });
                });
            });
        }
    });
};
