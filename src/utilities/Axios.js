import Axios from "axios";

function __get(url, token) {
    return Axios({
        url: url,
        baseURL: "https://local-historian.appspot.com/api/",
        method: "get",
        headers: { Authorization: "Bearer " + token },
    })
        .then(res => {
            return res;
        })
        .catch(error => {
            return error;
        });
}


function __post(data, url, token) {
    return Axios({
        url: url,
        baseURL: "https://local-historian.appspot.com/api/",
        method: "post",
        data: data,
        headers: { Authorization: "Bearer " + token },
    })
        .then(res => {
            return res;
        })
        .catch(error => {
            return error;
        })
}

export default { __get, __post };