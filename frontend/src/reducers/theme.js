const themeReducer = (state = "default", action) => {
    switch (action.type) {
        case "THEMECHANGE":
            return action.payload;
        default:
            return state;
    }
};

export default themeReducer;