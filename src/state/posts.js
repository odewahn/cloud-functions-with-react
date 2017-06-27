/*********************************************************************
||  Import required modules
*********************************************************************/
import { fromJS } from "immutable";

/*********************************************************************
||  Define the state tree
*********************************************************************/
const INITIAL_STATE = fromJS({
  is_loading: false,
  page: 1,
  posts: {}
});

/*********************************************************************
||  The reducer
*********************************************************************/
export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "setPostField":
      return state.set(action.key, action.value);
    default:
      return state;
  }
}

/*********************************************************************
||  Reducers actions
*********************************************************************/
export function setPostField(key, val) {
  return { type: "setPostField", key: key, value: val };
}

export function updatePostPage(delta) {
  return (dispatch, getState) => {
    var newVal = getState().Posts.get("page") + delta;
    dispatch(setPostField("page", newVal));
  };
}

/*********************************************************************
||  Async Actions
*********************************************************************/

export function fetchPosts() {
  return (dispatch, getState) => {
    dispatch(setPostField("is_loading", true));
    return fetch(
      "http://localhost:8010/react-gcloud-template/us-central1/posts",
      {
        method: "POST",
        body: JSON.stringify({
          page: getState().Posts.get("page")
        })
      }
    )
      .then(response => {
        return response.json();
      })
      .then(json => {
        console.log(json);
        dispatch(setPostField("is_loading", false));
        dispatch(setPostField("posts", fromJS(json)));
      });
  };
}
