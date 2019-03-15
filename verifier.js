var request = require('request');

var vstsAuth = process.env.VSTS_STATUS_AUTH;

var validChangeTypes = ['chore', 'hack', 'doc', 'wiki', 'test', 'fix', 'perf', 
    'build', 'refactor', 'style', 'feat' ];

function validate(context, title) {

    var result = {
        valid: false,
        msg: 'invalid commit msg!'
    }

    result.msg = 'empty title!';
    if (!title || !title.trim()) return result;

    result.msg = 'invalid change type!';
    var spaceIndex = title.indexOf(' ');
    if (spaceIndex < 1) return result;
    var changeType = title.substring(0, spaceIndex);
    if (validChangeTypes.indexOf(changeType) == -1) return result;

    result.msg = 'missing colon!';
    if ((spaceIndex + 1) == title.length) return result;
    title = title.substr(spaceIndex + 1);
    context.log('title:' + title);
    var colonIndex = title.indexOf(':');
    if (colonIndex == -1) return result;

    result.msg = 'missing component!';
    if (colonIndex < 3) return result;
    if (title[0] != '(' || title[colonIndex - 1] != ')') return result;
    var component = title.substring(1, colonIndex - 1);
    context.log('component:' + component);
    if (!component.trim()) return result;

    result.msg = 'invalid description!';
    if ((colonIndex + 1) == title.length) return result;
    var description = title.substr(colonIndex + 1);
    if (!description.trim() || description.length < 2) return result;

    result.msg = 'missing space after colon!';
    if (description[0] != ' ') return result;

    result.valid = true;
    result.msg = 'valid commit msg!'

    return result;
}

module.exports = function (context, req) {
    
    // context.log(req);
    if (req.query.hasOwnProperty('key') && req.query.key == 'ping') {
        context.log("ping");
        context.res = { status: 200, body: { message: 'pong!' } };
        context.done();
        return;
    }

    var title = req.body.resource.title;
    var result = validate(context, title);
    var baseUrl = 'https://slb1-swt.visualstudio.com/';
    var projectId = req.body.resource.repository.project.id;
    var repoId = req.body.resource.repository.id;
    var pullRequestId = req.body.resource.pullRequestId;

    var statusUrl = baseUrl + projectId + '/_apis/git/repositories/' + repoId + '/pullRequests/' + pullRequestId + "/statuses?api-version=5.0-preview.1";
    var statusObj = {
        "state": result.valid ? "succeeded" : "failed",
        "description": result.msg,
        "targetUrl": "google.com",
        "context": {
            "name": "commit-msg",
            "genre": "info"
        }
    }

    var pullReqUrl = baseUrl + projectId + '/_apis/git/repositories/' + repoId + '/pullRequests/' + pullRequestId + "?api-version=5.0-preview.1";
    var pullRequestInfo = {
        "completionOptions": {
            "mergeCommitMessage": title
        }
    }

    context.log("pull request url: " + pullReqUrl);
    request.patch({
        url: pullReqUrl,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + vstsAuth
        },
        body: JSON.stringify(pullRequestInfo)
    }, function (error, response, body) {
        context.log("status url: " + statusUrl);
        request.post({
            url: statusUrl,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + vstsAuth
            },
            body: JSON.stringify(statusObj)
        }, function (error, response, body) {
            context.res = {
                status: 200 /* Defaults to 200 */
            };
            context.done();
        })
    });
};
