import axios from "axios";
import {getToken} from "./userAPI";

export const allMessagesInChat = async (sender, receiver, page) => {
    return axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API_URL}messages/search/messagesInDialog`,
        params: {
            sender: sender.id,
            receiver: receiver.id,
            page: page,
            size: 10
        },
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}

export const updateMessage = async (message) => {

    return axios({
        method: 'PUT',
        url: `${process.env.REACT_APP_API_URL}messages/` + message.id,
        data: message,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}

export const removeMessage = async (message) => {
    return axios({
        method: 'DELETE',
        url: `${process.env.REACT_APP_API_URL}messages/` + message.id,
        data: message,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}

export const doRequest = async (url) => {
    return axios({
        method: 'GET',
        url: url,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}

export const allUserDialogs = async () => {
    return axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API_URL}user/dialogs`,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}