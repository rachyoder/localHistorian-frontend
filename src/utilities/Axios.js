import Axios from "axios";

function __get(url, token) {
    return Axios({
        url: url,
        baseURL: "http://127.0.0.1:8000/api/",
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
        baseURL: "http://127.0.0.1:8000/api/",
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