import {$host} from "./index";
import axios from "axios";

export const registration = async (name, surname, username, email, password, passwordConfirm) => {
    return await $host.post('auth/register', {name, surname, username, email, password, passwordConfirm})

}

export const login = async (username, password) => {
    const {data} = await $host.post('auth/login', {username, password})
    localStorage.setItem('token', data.token)
    console.log(getToken())
    return data
}

export const logout = async () => {
    return axios({
        method: 'POST',
        url: `${process.env.REACT_APP_API_URL}auth/logout`,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}

export const getToken = () => {
    return localStorage.getItem('token')
}

export const info = async () => {
    return axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API_URL}auth/info`,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}
export const allUsers = async () => {
    return axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API_URL}users`,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}

export const findUsers = async (username, page) => {
    return axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API_URL}users/search/usersInChat`,
        params: {
            'username': username,
            'page': page,
            'size': 5
        },
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}

export const deleteUser = async (id) => {
    return axios({
        method: 'DELETE',
        url: `${process.env.REACT_APP_API_URL}users/` + id,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}


export const editPassword = async (oldPassword, newPassword, newPasswordConfirm) => {

    return axios({
        method: 'PUT',
        url: `${process.env.REACT_APP_API_URL}profile/changePassword`,
        data: {
            password: oldPassword,
            newPassword: newPassword,
            newPasswordConfirm: newPasswordConfirm
        },
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}

export const editProfile = async (formData) => {

    return fetch(`${process.env.REACT_APP_API_URL}profile/changeInfo`, {
        method: "PUT",
        body: formData,
        headers: {'Authorization': 'Bearer ' + getToken()}
    })
}


