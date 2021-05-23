import themeReducer from "./theme";
import profileReducer from "./profile";
import sidebarReducer from "./sidebar";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    themeReducer,
    profileReducer,
    sidebarReducer
})

export default rootReducer;