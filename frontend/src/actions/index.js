
const themeChange = (theme) => {
    return {
        type: "THEMECHANGE",
        payload: { theme: theme }
    };
}


export { themeChange }
