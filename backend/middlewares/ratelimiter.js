const rateLimit = require("express-rate-limit");

module.exports = {
    perMinuteLimit: rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 150,
        message: "Bruh that's too much! You're gonna overheat the server smh"
    })
};
