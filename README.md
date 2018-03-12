# mercury

delivers messages from various inputs to slack, teams etc..

## Incoming Payloads

### vsts

request:

```json
{
   "Method":"POST",
   "URI":"",
   "HTTP Version":"1.1",
   "Headers":{
      "Content-Type":"application/json; charset=utf-8"
   },
   "Content":{
      "attachments":[
         {
            "color":"good",
            "fields":[
               {
                  "title":"Requested by",
                  "value":"Normal Paulk",
                  "short":true
               },
               {
                  "title":"Duration",
                  "value":"00:02:03",
                  "short":true
               },
               {
                  "title":"Build Definition",
                  "value":"ConsumerAddressModule",
                  "short":true
               }
            ],
            "pretext":"Build <https://fabrikam-fiber-inc.visualstudio.com/web/build.aspx?pcguid=5023c10b-bef3-41c3-bf53-686c4e34ee9e&builduri=vstfs%3a%2f%2f%2fBuild%2fBuild%2f3|ConsumerAddressModule_20150407.2> succeeded",
            "mrkdwn_in":[
               "pretext"
            ],
            "fallback":"Build ConsumerAddressModule_20150407.2 succeeded"
         }
      ]
   }
}
```

log:

```log
2018-03-09T16:10:48.502 [Info]
```

```json
{
   "originalUrl":"",
   "method":"POST",
   "query":{
      "code":"hIW89sbvOPr8eidB/N9Z0QBfmQd9q1sRnVcw961Q1sIqm/PLVaNXkA=="
   },
   "headers":{
      "connection":"Keep-Alive",
      "expect":"100-continue",
      "host":"blue-army.azurewebsites.net",
      "max-forwards":"10",
      "x-waws-unencoded-url":"",
      "x-original-url":"",
      "x-arr-log-id":"13395830-1754-49a5-b655-0523afafc4ce",
      "disguised-host":"blue-army.azurewebsites.net",
      "x-site-deployment-id":"blue-army",
      "was-default-hostname":"blue-army.azurewebsites.net",
      "x-forwarded-for":"104.45.30.58:54216",
      "x-arr-ssl":"2048|256|C=US, S=Washington, L=Redmond, O=Microsoft Corporation, OU=Microsoft IT, CN=Microsoft IT TLS CA 4|CN=*.azurewebsites.net",
      "x-forwarded-proto":"https",
      "content-length":"529",
      "content-type":"application/json; charset=utf-8"
   },
   "body":{
      "attachments":[
         {
            "color":"good",
            "fields":[
               {
                  "title":"Requested by",
                  "value":"Normal Paulk",
                  "short":true
               },
               {
                  "title":"Duration",
                  "value":"00:02:03",
                  "short":true
               },
               {
                  "title":"Build Definition",
                  "value":"ConsumerAddressModule",
                  "short":true
               }
            ],
            "pretext":"Build <https://fabrikam-fiber-inc.visualstudio.com/web/build.aspx?pcguid=5023c10b-bef3-41c3-bf53-686c4e34ee9e&builduri=vstfs%3a%2f%2f%2fBuild%2fBuild%2f3|ConsumerAddressModule_20150407.2> succeeded",
            "mrkdwn_in":[
               "pretext"
            ],
            "fallback":"Build ConsumerAddressModule_20150407.2 succeeded"
         }
      ]
   },
   "params":{

   },
   "rawBody":{
      "attachments":[
         {
            "color":"good",
            "fields":[
               {
                  "title":"Requested by",
                  "value":"Normal Paulk",
                  "short":true
               },
               {
                  "title":"Duration",
                  "value":"00:02:03",
                  "short":true
               },
               {
                  "title":"Build Definition",
                  "value":"ConsumerAddressModule",
                  "short":true
               }
            ],
            "pretext":"Build <https://fabrikam-fiber-inc.visualstudio.com/web/build.aspx?pcguid=5023c10b-bef3-41c3-bf53-686c4e34ee9e&builduri=vstfs%3a%2f%2f%2fBuild%2fBuild%2f3|ConsumerAddressModule_20150407.2> succeeded",
            "mrkdwn_in":[
               "pretext"
            ],
            "fallback":"Build ConsumerAddressModule_20150407.2 succeeded"
         }
      ]
   }
}
```

```log
2018-03-09T16:10:48.502 [Info] JavaScript HTTP trigger function processed a request.
2018-03-09T16:10:48.502 [Info] Function completed (Success, Id=bce975d8-35a6-4da3-b18c-c19d33a458ac, Duration=2ms)
2018-03-09T16:12:06  No new trace in the past 1 min(s).
```



### slack structure

```json
{
    "username": "crux",
    "icon_url": "https://www.microsoft.com/onerfstatics/marketingsites-wcus-prod/_h/b23f9ba2/coreui.statics/images/social/linkedin.png",
    "attachments":[
        {
            "color":"#36a64f",
            "icon_url": "https://slack.com/img/icons/app-57.png",
            "pretext":"<https://fabrikam-fiber-inc.visualstudio.com/web/build.aspx?pcguid=5023c10b-bef3-41c3-bf53-686c4e34ee9e&builduri=vstfs%3a%2f%2f%2fBuild%2fBuild%2f3|Planck-Documentation> build succeeded",
            "mrkdwn_in":[
                "pretext"
            ],
            "fallback":"Crux build succeeded!",
            "fields":[
                {
                    "title":"Requested by",
                    "value":"Lucas Natraj",
                    "short":true
                },
                {
                    "title":"Duration",
                    "value":"00:02:03",
                    "short":true
                },
                {
                    "title":"Build Definition",
                    "value":"Planck-Documentation-CI",
                    "short":true
                }
            ]
        }
    ]
}
```

`https://blue-army.visualstudio.com/web/build.aspx?pcguid=136fad61-8c1e-46bd-ae9a-1d69495773f8&builduri=vstfs%3a%2f%2f%2fBuild%2fBuild%2f89`

```json
{
    "originalUrl":"",
    "method":"POST",
    "query":{
        "code":"hIW89sbvOPr8eidB/N9Z0QBfmQd9q1sRnVcw961Q1sIqm/PLVaNXkA=="
    },
    "headers":{
        "connection":"Keep-Alive",
        "expect":"100-continue",
        "host":"blue-army.azurewebsites.net",
        "max-forwards":"10",
        "x-waws-unencoded-url":"",
        "x-original-url":"",
        "x-arr-log-id":"d057a6d4-f436-464f-bb21-a8f10c39de8a",
        "disguised-host":"blue-army.azurewebsites.net",
        "x-site-deployment-id":"blue-army",
        "was-default-hostname":"blue-army.azurewebsites.net",
        "x-forwarded-for":"104.45.30.58:53768",
        "x-arr-ssl":"2048|256|C=US, S=Washington, L=Redmond, O=Microsoft Corporation, OU=Microsoft IT, CN=Microsoft IT TLS CA 4|CN=*.azurewebsites.net",
        "x-forwarded-proto":"https",
        "content-length":"3138",
        "content-type":"application/json; charset=utf-8"
    },
    "body":{
        "subscriptionId":"bc217d22-b83b-4408-9c6a-3c2c37b4e0ab",
        "notificationId":1,
        "id":"81079c77-d343-4e46-9b0a-e565c7c893bc",
        "eventType":"build.complete",
        "publisherId":"tfs",
        "message":{
            "text":"Build 564668 has been canceled",
            "html":"Build <a href='https://slb1-swt.visualstudio.com/web/build.aspx?pcguid=a00d461b-cf15-473d-80c2-15f378b97c39&amp;builduri=vstfs%3a%2f%2f%2fBuild%2fBuild%2f564668'>564668</a> has been canceled",
            "markdown":"Build [564668](https://slb1-swt.visualstudio.com/web/build.aspx?pcguid=a00d461b-cf15-473d-80c2-15f378b97c39&builduri=vstfs%3a%2f%2f%2fBuild%2fBuild%2f564668) has been canceled"
        },
        "detailedMessage":{
            "text":"Build 564668 has been canceled\\r\\n\\r\\n- The build has been canceled by Lucas Natraj.\\r\\n",
            "html":"Build <a href='https://slb1-swt.visualstudio.com/web/build.aspx?pcguid=a00d461b-cf15-473d-80c2-15f378b97c39&amp;builduri=vstfs%3a%2f%2f%2fBuild%2fBuild%2f564668'>564668</a> has been canceled\\r\\n<ul>\\r\\n<li>The build has been canceled by Lucas Natraj.</li>\\r\\n</ul>",
            "markdown":"Build [564668](https://slb1-swt.visualstudio.com/web/build.aspx?pcguid=a00d461b-cf15-473d-80c2-15f378b97c39&builduri=vstfs%3a%2f%2f%2fBuild%2fBuild%2f564668) has been canceled\\r\\n\\r\\n+ The build has been canceled by Lucas Natraj.\\r\\n"
        },
        "resource":{
            "uri":"vstfs:///Build/Build/564668",
            "id":564668,
            "buildNumber":"564668",
            "url":"https://slb1-swt.visualstudio.com/a7e47f75-3058-4e37-85a8-4f7806df1f73/_apis/build/Builds/564668",
            "startTime":"2018-03-12T13:08:43.1034606Z",
            "finishTime":"2018-03-12T13:08:43.1034606Z",
            "reason":"manual",
            "status":"stopped",
            "drop":{
            },
            "log":{
            },
            "sourceGetVersion":"LG:refs/heads/master:19aa8f5d2633bc1e1217b6c397182aa6784c6128",
            "lastChangedBy":{
                "displayName":"Microsoft.VisualStudio.Services.TFS",
                "url":"https://dataimport-2f982585-cd22-459c-a220-2e5fa9266823.codex.ms/vssps/_apis/Identities/00000002-0000-8888-8000-000000000000",
                "id":"00000002-0000-8888-8000-000000000000",
                "uniqueName":"00000002-0000-8888-8000-000000000000@2c895908-04e0-4952-89fd-54b0046d6288",
                "imageUrl":"https://slb1-swt.visualstudio.com/_api/_common/identityImage?id=00000002-0000-8888-8000-000000000000"
            },
            "retainIndefinitely":false,
            "definition":{
                "definitionType":"xaml",
                "id":5233,
                "name":"Planck-Documentation-CI",
                "url":"https://slb1-swt.visualstudio.com/a7e47f75-3058-4e37-85a8-4f7806df1f73/_apis/build/Definitions/5233"
            },
            "queue":{
                "queueType":"buildController",
                "id":721,
                "name":"Hosted Linux Preview",
                "url":"https://slb1-swt.visualstudio.com/_apis/build/Queues/721"
            },
            "requests":[
                {
                    "id":564668,
                    "url":"https://slb1-swt.visualstudio.com/a7e47f75-3058-4e37-85a8-4f7806df1f73/_apis/build/Requests/564668",
                    "requestedFor":{
                        "displayName":"Lucas Natraj",
                        "id":"24233b78-76db-4160-aefc-06cd9c28032d",
                        "uniqueName":"LNatraj@slb.com"
                    }
                }
            ]
        },
        "resourceVersion":"1.0",
        "resourceContainers":{
            "collection":{
                "id":"a00d461b-cf15-473d-80c2-15f378b97c39",
                "baseUrl":"https://slb1-swt.visualstudio.com/"
            },
            "account":{
                "id":"2e7f277d-52be-485b-9c0f-f16f1f6adf39",
                "baseUrl":"https://slb1-swt.visualstudio.com/"
            },
            "project":{
                "id":"a7e47f75-3058-4e37-85a8-4f7806df1f73",
                "baseUrl":"https://slb1-swt.visualstudio.com/"
            }
        },
        "createdDate":"2018-03-12T13:08:48.3422948Z"
    }
}

```

### properties

name: `planck`
icon: `resourceurl`
requested by: `resource.requests.0.requestedFor.displayName
build: `resource.definition.name`
link: urlcombine - `resourceContainers.account.baseUrl` + `_permalink/_build/index?collectionId=` + `resourceContainers.collection.id` + `&projectId=` + `resourceContainers.project.id` + `&buildId=` + `resource.id`
status: `resource.status`

link: `https://slb1-swt.visualstudio.com/_permalink/_build/index?collectionId=a00d461b-cf15-473d-80c2-15f378b97c39&projectId=a7e47f75-3058-4e37-85a8-4f7806df1f73&buildId=564668"`