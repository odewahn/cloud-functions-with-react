# Starting a new app with `create-react-app`

[create-react-app](https://github.com/facebookincubator/create-react-app) is a tool from facebook that let's you "create React apps with no build configuration."  Basically, it's an opinionated way to structure your projects and tools.


## Install `create-react-app`

```
npm install -g create-react-app
```

## Create a new app

```
create-react-app cra-vsg-test
```

Then cd into the new directory.

Once you're in there, you can do `npm start` to see that it's working.


## Install redux and dependencies

```
npm install --save redux react-redux redux-thunk immutable react-router material-ui
```


## Set up and install the VSG

Following the [for developers](https://http.styleguide.svc.dev-seb.local/#for-developers) instructions in the styleguide, add the internal package manager to the `.npmrc` file:

```
@oreilly:registry=https://http.npm.svc.dev-seb.local
registry=https://registry.npmjs.org/
strict-ssl=false
```

You can tweak the locations:

* https://http.npm.svc.dev-seb.local -  hosted in Sebastopol
* https://http.npm.svc.prod-sfo.local -  hosted in San Francisco
* https://http.npm.svc.prod-1summer.local - hosted in Boston (coming soon)

Once you're set up, install the packages.  Be sure to include the `@oreilly` namespace so that `nom` picks up the internal registry:

```
npm install --save-dev @oreilly/shape-react-core @oreilly/shape-css
```

## Replace `src/App.js` content

Open the `src/App.js` and replace it with this:

```
import React, { Component } from "react";
import { SafariChrome } from "@oreilly/shape-react-core";

import "@oreilly/shape-react-core/index.css";
import "@oreilly/shape-css/grid.css";

const user = {
  user_type: "Trial",
  user_identifier: "f38ee9b3-06f5-468a-a245-000000000000",
  primary_account: "b70baefa-e8ed-44ca-8a6e-111111111111",
  username: "odewahn",
  first_name: "Andrew",
  last_name: "Odewahn",
  salesforce_id: "foobar",
  permissions: {
    view_full_epub: true,
    view_collections: false
  }
};

export default class MyUserInfo extends Component {
  render() {
    return (
      <SafariChrome user={user}>
        <iframe src="http://jupyterhub.odewahn.com"></iframe>
      </SafariChrome>
    );
  }
}
```

## Run `npm start`

Run `npm start` and you should see something gooooood.

## Proxying to a backend

See this article https://daveceddia.com/create-react-app-express-backend/

Add this to the `package.json` to proxy to a backend service for any ajax calls (this is the guts of the app):

```
  "proxy": "http://localhost:3001"
```

Then you run the service you want to proxy to on some other port (or even do it remotely).


## Installing this repo as is

If you just want to view this app, you can clone the repo and then run `npm install` to download and install all the dependencies.  Then do `npm start` to view the app:

<img src="public/demo.gif"/>
