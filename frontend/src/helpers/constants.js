const THEMES = [
    { id: "default", value: "Default" },
    { id: "light-theme", value: "Light" }
]

const PRIVILEGES = {
    read: "R",
    readWrite: "RW",
    none: "None"
}

const ERRORMSG = {
    invalidUrl: "Invalid URL Parameter",
    noPrivilege: "You have no privilege to do that"
}
export { THEMES, PRIVILEGES, ERRORMSG }