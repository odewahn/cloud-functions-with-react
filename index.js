var fetch = require("node-fetch");
var FormData = require("form-data");
var querystring = require("query-string");

// See https://mhaligowski.github.io/blog/2017/03/10/cors-in-cloud-functions.html
// For better syntax, see https://gist.github.com/mediavrog/49c4f809dffea4e00738a7f5e3bbfa59
const cors = require("cors")();

//===========================================================================
// Get the topic types from ORM site
//===========================================================================
exports.posts = (req, res) => {
  // Parse the body to get the passed values
  var bodyObj = req.body ? JSON.parse(req.body) : {};
  var page = 1;
  if (bodyObj["page"]) {
    page = bodyObj["page"];
  }
  console.log("getting page", page);
  // Wrap function in a CORS header so is can be called in the browser
  cors(req, res, () => {
    // Lookup the account type based on the email.
    fetch("https://gateway.oreilly.com/clients/website/feed/all/page/" + page, {
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        res.send(data["posts"]);
      });
  });
};
