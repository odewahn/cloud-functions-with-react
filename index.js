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
