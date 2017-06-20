/*********************************************************************
||  Import required modules
*********************************************************************/
import { fromJS } from "immutable";

/*********************************************************************
||  Define the state tree
*********************************************************************/
const INITIAL_STATE = fromJS({
  name: "andrew",
  email: "andrew@oreilly.com"
});

/*********************************************************************
||  The reducer
*********************************************************************/
export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "setName":
      return state.set(action.key, action.value);
    default:
      return state;
  }
}

/*********************************************************************
||  Async Actions
*********************************************************************/

export function fetchUserAccountType(email) {
  console.log(email);
  return (dispatch, getState) => {
    return fetch(
      "http://localhost:8010/safari-mobile-auth/us-central1/accountType",
      {
        method: "POST",
        body: JSON.stringify({
          email: email
        })
      }
    )
      .then(response => {
        return response.json();
      })
      .then(json => {
        console.log(json);
      });
  };
}
