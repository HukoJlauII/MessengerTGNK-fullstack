import {makeAutoObservable} from "mobx";

export default class UserStore {

    constructor() {
        this._isAuth = false
        this._user = {}
        makeAutoObservable(this)
    }

    setIsAuth(value) {
        this._isAuth = value;
    }

    setUser(value) {
        this._user = value;
    }


    get isAuth() {
        return this._isAuth;
    }

    get user() {
        return this._user;
    }

    get isAdmin() {
        if (this.isAuth) {
            return this._user.roles.includes('ROLE_ADMIN')
        } else return false
    }

    get avatarPicture() {
        if (this._user.avatar) {
            return "http://localhost:8080/api/media/" + this._user.avatar.id
        } else {
            return "https://bootdey.com/img/Content/avatar/avatar6.png"
        }
    }

}