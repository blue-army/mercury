var request = require('request');

module.exports = function (context, req) {

    context.log(req)

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
            pretext: "Build",
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

    // if (req.query.name || (req.body && req.body.name)) {
    //     context.res = {
    //         // status: 200, /* Defaults to 200 */
    //         body: "Hello " + (req.query.name || req.body.name)
    //     };
    // }
    // else {
    //     context.res = {
    //         status: 400,
    //         body: "Please pass a name on the query string or in the request body"
    //     };
    // }

    const url = process.env.SLACK_URL;

    // log slack message
    context.log(JSON.stringify(slack))

    request.post({
        url: url,
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