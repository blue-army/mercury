var request = require('request');
require('dotenv').config()

module.exports = function (context, req) {

    context.log(req)

    const hook = process.env.SLACK_URL;
    var username = "planck";
    var icon = "https://bluearmy.blob.core.windows.net/slacker-assets/Skull-48.png";
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
            mrkdwn_in:[
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
        json:true
    }, function(error, response, body) {        
        context.log(error);
        context.log(JSON.stringify(response));
        context.log(body);
        context.done();
    });
};