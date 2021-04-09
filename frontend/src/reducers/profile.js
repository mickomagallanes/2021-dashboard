let profileObj = {
    username: "",
    userimg: ""
};
const profileReducer = (state = profileObj, action) => {
    switch (action.type) {
        case "PROFILECHANGE":
            return action.payload;
        default:
            return state;
    }
};

export default profileReducer;