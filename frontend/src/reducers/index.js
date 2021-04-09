import themeReducer from "./theme";
import profileReducer from "./profile";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    themeReducer,
    profileReducer
})

export default rootReducer;