const axiosConfig = {
    withCredentials: true,
    timeout: 10000
}


function equalTo(ref, msg) {
    return this.test({
        name: 'equalTo',
        exclusive: false,
        message: msg,
        params: {
            reference: ref.path
        },
        test: function (value) {
            return value === this.resolve(ref)
        }
    })
}

/**
 * used when an ajax request fails, execute callback function after timeout
 * @param {Function} callback function to be executed after the timer expires
 */
function retryRequest(callback) {
    setTimeout(() => {
        callback();
    }, 3000);
}

export {
    retryRequest,
    equalTo,
    axiosConfig
}