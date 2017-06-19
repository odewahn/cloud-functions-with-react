# Starting a new app with `create-react-app`

[create-react-app](https://github.com/facebookincubator/create-react-app) is a tool from facebook that let's you "create React apps with no build configuration."  Basically, it's an opinionated way to structure your projects and tools.


## Install `create-react-app`

```
npm install -g create-react-app
```

## Create a new app

Clone this repo and reset the git history (i.e., delete the `.git` directory and then `git init` again).  The run `npm install`.  


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

Start hacking...
