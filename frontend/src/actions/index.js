
const themeChange = (theme) => {
    return {
        type: "THEMECHANGE",
        payload: { theme: theme }
    };
}

const profileChange = (userName, userImg) => {
    return {
        type: "PROFILECHANGE",
        payload: { username: userName, userimg: userImg }
    };
}

const sidebarChange = (sidebarData) => {
    return {
        type: "SIDEBARCHANGE",
        payload: sidebarData
    };
}

export {
    themeChange,
    profileChange,
    sidebarChange
}
