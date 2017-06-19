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
  }
  return state;
}
