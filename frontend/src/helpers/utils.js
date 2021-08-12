import moment from "moment";

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

function formatDate(date, format) {
    if (!date) {
        return moment().format(format); // return current date
    }
    let d = new Date(date);
    return moment(d).format(format);
}

export {
    retryRequest,
    equalTo,
    axiosConfig,
    axiosConfigFormData,
    formatDate
}