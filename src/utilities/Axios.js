import Axios from "axios";

/* Axios GET call to the API -- Takes in a path and a token for authorization */
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

/* Axios POST call to the API -- Takes in a path, token and data for posting to the api, typically for adding to the database */
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