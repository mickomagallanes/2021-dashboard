// non blocking for loop
function loopArr(arr, callback) {
    return new Promise(function (resolve, reject) {
        let n = arr.length;
        // Save ongoing sum in JS closure.
        function help(i, cb) {
            if (i == n) {
                resolve(true);
                return;
            }
            cb(i);
            // "Asynchronous recursion".
            // Schedule next operation asynchronously.
            setImmediate(help.bind(null, i + 1, cb));
        }

        // Start the helper
        help(0, callback);
    });
}

// non blocking for loop
function mapArr(arr, callback) {
    return new Promise(function (resolve, reject) {
        let newArr = [];
        let n = arr.length;
        // Save ongoing sum in JS closure.
        function help(i, cb) {
            if (i == n) {
                resolve(newArr);
                return;
            }
            if (cb(i)) {
                newArr.push(i);
            }
            // "Asynchronous recursion".
            // Schedule next operation asynchronously.
            setImmediate(help.bind(null, i + 1, cb));
        }

        // Start the helper
        help(0, callback);
    });
}

module.exports = { loopArr, mapArr }