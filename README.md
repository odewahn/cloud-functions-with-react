# Using Google Cloud Functions with React

[Cloud Functions](https://cloud.google.com/functions/) is Google's entry into the [serverless computing](https://en.wikipedia.org/wiki/Serverless_computing) craze.  This architectural approach promises to dramatically reduce the cost and complexity of developing, scaling, and operating a web application.  While there are still a host of issues to resolve, the potential benefits are enormous.

This article and [companion github repo](https://github.com/odewahn/cloud-functions-with-react) show how to use Cloud Functions as the backend for a React app that can be deployed as a static website.  While frameworks like [serverless](https://serverless.com/) provide more features, the approach presented here is a simple and quick way to get a basic frontend and backend up and running quickly.

The following sections will walk you through how to set a simple example that uses cloud functions to hit an API (the list of articles on oreilly.com), and an accompanying React frontend that will let you page through the data.

<img width="50%" src="app.gif"/>

The frontend will also show how to:

* Set up [redux](https://github.com/reactjs/redux) to manage application state
* Set up middleware to load data from our backend; it also shows how to set a loading spinner while the data is being fetched
* Use the [material-ui](https://github.com/callemall/material-ui) framework to create a super simple UI
* Dispatch events to page through the API data

Before you start, you'll need to:

* Create a [google cloud account](https://cloud.google.com/)
* Install the [Google cloud sdk](https://cloud.google.com/sdk/) so that you can manage your cloud from the command line.
* Install (or already have) [Node](https://nodejs.org/en/) version 6 or higher.
* Install (or already have)[create-react-app](https://github.com/facebookincubator/create-react-app), Facebook's awesome utility for bootstrapping, developing, and building React projects.
* Clone the [odewahn/cloud-functions-with-react](https://github.com/odewahn/cloud-functions-with-react) repository from GitHub.  Once you clone the repository, `cd` into it and run `npm install`.

Once you've got these pieces in place, move on to the next section.

## Create a new gcloud project

Google Cloud organizes projects into, well, projects.  So, the first step is to create a new one.  Since this is intended as a basic template to get started, I'll calling it `react-gcloud-template`:

```
gcloud projects create react-gcloud-template
```

This takes about 30-45 seconds.  Then you can set it to be the default project for all subsequent `gcloud` commands:

```
$ gcloud config set core/project react-gcloud-template
```

## Install and configure the Cloud Functions emulator

The [cloud functions emulator](https://github.com/GoogleCloudPlatform/cloud-functions-emulator) allows you to develop and test functions locally, which vastly accelerates development speed.

```
npm install -g @google-cloud/functions-emulator
```

Once it's installed, set your new project:

```
functions config set projectId react-gcloud-template
```

Next, start the emulator:

```
functions start
```

Finally, deploy the `posts` function to the emulator, like this:

```
functions deploy posts --trigger-http
```

The `posts` function is defined in the root level file `index.js` onto the emulator, and uses the [node-fetch](https://www.npmjs.com/package/node-fetch) module to grab a page-by-page list of articles from oreilly.com:

```
var fetch = require("node-fetch");
const cors = require("cors")();

//===========================================================================
// Get the topic types from ORM site
//===========================================================================
exports.posts = (req, res) => {
  // Parse the body to get the passed values
  var params;
  try {
    // try to parse the body for passed parameters
    params = JSON.parse(req.body);
  } catch (e) {
    // provide default values if there is an error
    params = { page: 1 };
  }
  // Wrap function in a CORS header so is can be called in the browser
  cors(req, res, () => {
    // Lookup the account type based on the email.
    fetch(
      "https://gateway.oreilly.com/clients/website/feed/all/page/" +
        params["page"],
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

Two small but important things to observe.  First, note how the return function is wrapped in a `cors` function call; this adds the headers required to get around the browser's cross-origin restrictions.  Second, notice how we're only returning a part of the data we get back (just the values in `data["posts"]`).  This shows how we can use the Cloud Function to transform a raw API call, which can be valuable when you're developing microservices against a larger API infrastructure.

```
http -b http://localhost:8010/react-gcloud-template/us-central1/posts page=1

[
    {
        "byline": {
            "authors": [
                {
                    "first-name": "Hadi",
                    "last-name": "Hariri",
                    "url": "/people/7fd97-hadi-hariri"
                }
            ]
        },
        "dek": "Learn how Kotlin functions easily accept default and multiple parameters.",
        "permalink": "https://www.oreilly.com/learning/simple-functions-in-kotlin",
        "title": "Simple functions in Kotlin"
    },
    ...
]
```

You can also add new functions to `index.js`, using `posts` as a template.  Just be sure that you deploy each one individually.  Once exported, all your changes will be "live" in the emulator each time you update and save the file, so that you'll be executing the new code once you call the function again.  This is a huge time savings compared to having to deploy the function directly to Google Cloud, and one of the key strengths of using the `functions` emulator.


## Deploying your function to Google Cloud

Once your function is works, you're can deploy it to Cloud Functions (versus just the emulator).  To do this, you'll need to enable billing and Cloud Functions in the [cloud console](https://console.cloud.google.com).

Once you've enabled everything, you first create a [cloud storage bucket](https://cloud.google.com/storage/docs/json_api/v1/buckets) where your code will be uploaded.  (This bucket will also have the `node_modules` folder for all your dependencies.) Go into the console and make a button where your code where your code can be uploaded to gcloud.  It has to have a globally unique name.  I called mine `ano-auth-test-bucket`. Alternatively, you can also use [gsutil](https://cloud.google.com/storage/docs/gsutil) tool, a command line utility for working with gCloud:

```
gsutil mb -p react-gcloud-template gs://react-gcloud-template-deploy
```

(If you get an error like `AccessDeniedException: 403 The account for bucket "react-gcloud-template-deploy" has been disabled.` then you need to enable billing on the project in the console.)

Once you've create the bucket, you're ready to deploy.  (Before you do, remember to run `npm install` to download any dependencies.):

```
gcloud beta functions deploy posts --stage-bucket react-gcloud-template-deploy --trigger-http
```

That will produce a log like this:

```
Copying file:///var/folders/hj/x05v_3s544n68fqr31pxsjwr0000gn/T/tmpFaEd0v/fun.zip [Content-Type=application/zip]...
/ [1 files][  3.9 MiB/  3.9 MiB]                                                
Operation completed over 1 objects/3.9 MiB.                                      
Deploying function (may take a while - up to 2 minutes)...done.                                                       
availableMemoryMb: 256
entryPoint: posts
httpsTrigger:
  url: https://us-central1-react-gcloud-template.cloudfunctions.net/posts
latestOperation: operations/cmVhY3QtZ2Nsb3VkLXRlbXBsYXRlL3VzLWNlbnRyYWwxL3Bvc3RzLzNfQXlBNGR2LUhN
name: projects/react-gcloud-template/locations/us-central1/functions/posts
serviceAccount: react-gcloud-template@appspot.gserviceaccount.com
sourceArchiveUrl: gs://react-gcloud-template-deploy/us-central1-posts-unmlnlxxrudy.zip
status: READY
timeout: 60s
updateTime: '2017-06-28T14:18:12Z'
```

The `httpsTrigger` section of the log has the URL for the deployed function:

```
http https://us-central1-react-gcloud-template.cloudfunctions.net/posts
```

If you forget this link, you can always recover it like this:

```
$ gcloud beta functions list
NAME   STATUS  TRIGGER
posts  READY   HTTP Trigger
```

And then `describe` it, like so:

```
$ gcloud beta functions describe posts
availableMemoryMb: 256
entryPoint: posts
httpsTrigger:
  url: https://us-central1-react-gcloud-template.cloudfunctions.net/posts
latestOperation: operations/cmVhY3QtZ2Nsb3VkLXRlbXBsYXRlL3VzLWNlbnRyYWwxL3Bvc3RzLzNfQXlBNGR2LUhN
name: projects/react-gcloud-template/locations/us-central1/functions/posts
serviceAccount: react-gcloud-template@appspot.gserviceaccount.com
sourceArchiveUrl: gs://react-gcloud-template-deploy/us-central1-posts-unmlnlxxrudy.zip
status: READY
timeout: 60s
updateTime: '2017-06-28T14:18:12Z'
```

## Set up the frontend


Once you've set up the backend functions, you're ready to tackle the frontend.  If you're starting completely from scratch (as opposed to cloning from an existing project), you'll need [create-react-app](https://github.com/facebookincubator/create-react-app), a tool from Facebook that let's you "create React apps with no build configuration."  Basically, it's an opinionated way to structure your projects and tools.

```
npm install -g create-react-app
```

If you haven't already, run `npm install` to download all your dependencies into the `node_modules` directory.  

Once `npm install` completes, run `npm start` to fire up the app.  Note that you may need to modify the URL in `src/state/posts.js` to match your functions emulator:

```
return fetch(
  "http://localhost:8010/react-gcloud-template/us-central1/posts",
  {
    method: "POST",
    body: JSON.stringify({
      page: getState().Posts.get("page")
    })
  }
)
```

From then on, you can make changes in the React app and thanks to the magic of `create-react-app`, you'll get immediate hot reloading for your project.

As a quick description of how the project is organized:

* All the frontend code is in the `src` directory, which is the default from `create-react-app`
* The main entry point, `src/App.js`, sets up the `redux` store and the `redux-thunk` middleware.
* The `src/state` directory has all the redux stores.  I like to use `combine-reducers` so that I can break out the state tree into logical units, so if you want to add a new kind of state object, put it in a new file (you can use `src/state/posts.js` as a template) and then add is into the combined reducers in `srs/state/index.js`.
* All the state logic for this sample is in `src/state/posts.js`.  In addition to the ability to dispatch a thunk that retrieves data from our API, I've also set up logic to control a spinner.  In production code, you'd want to also do things like handling errors, but that's beyond the scope of this article.
* The main UI component is in `src/components/posts.js`.  This shows how to use the [material-ui](https://github.com/callemall/material-ui) toolkit to make a simple UI that consists of a list based on the API results, along with a couple of nav buttons to page though the results.

## Where to go next
