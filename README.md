# Create React  with Google Cloud Functions



## Setting up the gcloud backend


### Create a new gcloud project

First create a new project:  

```
gcloud projects create react-gcloud-template
```

This takes about 30-45 seconds.  Then you can set it to be the default project for all subsequent `gcloud` commands:

```
$ gcloud config set core/project react-gcloud-template
```

### Install Google cloud functions emulator

The [cloud functions emulator](https://github.com/GoogleCloudPlatform/cloud-functions-emulator) allows you to develop and test functions locally.

```
npm install -g @google-cloud/functions-emulator
```

Here's what you do once you get it installed.

### Set the default project

```
functions config set projectId react-gcloud-template
```

### Start the emulator

```
functions start
```

### Creating a functions


`cors` and `node-fetch`


```
exports.posts = (req, res) => {
  // Parse the body to get the passed values
  var bodyObj = res.body ? JSON.parse(req.body) : {};
  var page = 0;
  if (bodyObj["page"]) {
    page = bodyObj["page"];
  }
  // Wrap function in a CORS header so is can be called in the browser
  cors(req, res, () => {
    // Lookup the account type based on the email.
    fetch(
      "https://orm-prototype-api.herokuapp.com/clients/website/feed/all/page/" +
        page,
      {}
    )
      .then(res => {
        return res.json();
      })
      .then(data => {
        res.send(data["posts"]);
      });
  });
};
```


### Deploy the function

Once you've created a function in index, you have to deploy it to the emulator, like this:

```
functions deploy posts --trigger-http
```

### List the functions

$ functions list
┌────────┬────────────┬─────────┬─────────────────────────────────────────────────────────────────┐
│ Status │ Name       │ Trigger │ Resource                                                        │
├────────┼────────────┼─────────┼─────────────────────────────────────────────────────────────────┤
│ READY  │ helloWorld │ HTTP    │ http://localhost:8010/safari-mobile-auth/us-central1/helloWorld │
└────────┴────────────┴─────────┴─────────────────────────────────────────────────────────────────┘

###  Check out your new function

```
$ http -b http://localhost:8010/safari-mobile-auth/us-central1/helloWorld name=Andrew
Hello Andrew!
```


## Create a bucket where you will deploy your code

Go into the console and make a button where your code where your code can be uploaded to gcloud.  It has to have a globally unique name.  I called mine `ano-auth-test-bucket`.

You can also use `gsutil`:

```
gsutil mb -p [PROJECT_ID] gs://[BUCKET_NAME]
```

## Deploy a function

```
gcloud beta functions deploy accountType --stage-bucket ano-auth-test-bucket --trigger-http
```

That will produce a bunch a log like this:

```
Copying file:///var/folders/hj/x05v_3s544n68fqr31pxsjwr0000gn/T/tmp2OJKOV/fun.zip [Content-Type=application/zip]...
- [1 files][397.4 KiB/397.4 KiB]                                                
Operation completed over 1 objects/397.4 KiB.                                    
Deploying function (may take a while - up to 2 minutes)...done.                
availableMemoryMb: 256
entryPoint: accountType
httpsTrigger:
  url: https://us-central1-safari-mobile-auth.cloudfunctions.net/accountType
latestOperation: operations/c2FmYXJpLW1vYmlsZS1hdXRoL3VzLWNlbnRyYWwxL2FjY291bnRUeXBlL3Z3S1FtRURpbTNr
name: projects/safari-mobile-auth/locations/us-central1/functions/accountType
serviceAccount: safari-mobile-auth@appspot.gserviceaccount.com
sourceArchiveUrl: gs://ano-auth-test-bucket/us-central1-accountType-hcoeqzanneab.zip
status: READY
timeout: 60s
updateTime: '2017-06-17T12:36:12Z'
```

```
gcloud beta functions deploy usernamePasswordAccount --stage-bucket ano-auth-test-bucket --trigger-http

gcloud beta functions deploy authenticateSSOUser --stage-bucket ano-auth-test-bucket --trigger-http

```



## Set up the frontend


[create-react-app](https://github.com/facebookincubator/create-react-app) is a tool from facebook that let's you "create React apps with no build configuration."  Basically, it's an opinionated way to structure your projects and tools.


## Install `create-react-app`

```
npm install -g create-react-app
```

## Create a new app

Clone this repo and reset the git history (i.e., delete the `.git` directory and then `git init` again).  The run `npm install`.  


## Run `npm start`

Run `npm start` and you should see something gooooood.



## Deploying your code
