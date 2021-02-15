function checkSession(req) {
    console.log(req.session);
    return req.session.userData;
}

function clearCookie(res) {
    res.clearCookie('d3krabbit');
}

module.exports = {
    checkSession,
    clearCookie
}