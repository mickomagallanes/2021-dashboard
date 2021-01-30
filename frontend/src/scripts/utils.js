/**
    * used for GET AJAX
    * @param {String} url url used to specify the target url
    * @return retdata return data from the AJAX request
    */

function fetchGet(url) {
    return new Promise(function (resolve, reject) {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    let retdata = JSON.parse(this.response);
                    resolve(retdata)
                } else {
                    resolve(false);
                }
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send();
    })
}

/**
 * used for POST AJAX
 * @param {String} url used to specify the target url
 * @param {*} param the parameter that is going to be sent
 * @return retdata return data from the AJAX request
 */
function fetchPost(url, param) {
    return new Promise(function (resolve, reject) {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    let retdata = JSON.parse(this.response);

                    resolve(retdata)
                } else {
                    resolve(false);
                }
            }
        }
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify(param));
    })
}

/**
 * used to create option for combobox/select (ReactJS version)
 * @param {Array} dataArr data to be used
 * @return items array of option elements
 */
function createSelectItems(dataArr) {
    let items = [];
    for (let i = 0, n = dataArr.length; i < n; i++) {
        items.push(<option key={dataArr[i].value} value={dataArr[i].value}>{dataArr[i].text}</option>);
    }
    return items;
}

/**
 * used when an ajax request fails, execute callback function after timeout
 * @param {Function} callback function to be executed after the timer expires
 */
function retryRequest(callback) {
    setTimeout(() => {
        callback();
    }, 5000);
}

export {
    fetchGet,
    fetchPost,
    createSelectItems,
    retryRequest
}