let sidebarData = [];
const sidebarReducer = (state = sidebarData, action) => {
    switch (action.type) {
        case "SIDEBARCHANGE":
            return action.payload;
        default:
            return state;
    }
};

export default sidebarReducer;