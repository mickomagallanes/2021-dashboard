const axiosConfig = {
    withCredentials: true,
    timeout: 10000
}

const axiosConfigFormData = { ...axiosConfig, headers: { 'Content-Type': "multipart/form-data" } }

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

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

export {
    retryRequest,
    equalTo,
    axiosConfig,
    axiosConfigFormData,
    formatDate
}