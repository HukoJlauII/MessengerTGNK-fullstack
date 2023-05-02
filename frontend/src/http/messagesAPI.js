import axios from "axios";
import {getToken} from "./userAPI";

export const allMessagesInChat = async (sender, receiver, page) => {
    return axios({
        method: 'GET',
        url: `http://localhost:8080/api/messages/search/messagesInDialog`,
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
    console.log(message)
    return axios({
        method: 'PUT',
        url: `http://localhost:8080/api/messages/` + message.id,
        data: message,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}

export const removeMessage = async (message) => {
    return axios({
        method: 'DELETE',
        url: `http://localhost:8080/api/messages/` + message.id,
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
        url: `http://localhost:8080/api/user/dialogs`,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}