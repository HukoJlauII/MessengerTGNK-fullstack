import {BrowserRouter, Route, Routes} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import "bootstrap-icons/font/bootstrap-icons.css";
import './assets/css/style.css'
import "./assets/js/main.js"
import "./assets/css/chat.css"
import {getToken, info} from "./http/userAPI";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import ReactLoading from "react-loading"
import {AdminPage} from "./pages/AdminPage";
import 'dayjs/locale/ru'
import dayjs from "dayjs";
import {authRoutes, publicRoutes} from "./routes";
import SockJS from "sockjs-client";
import {over} from "stompjs";


dayjs.locale('ru')
export var stompClient
export var Sock

export function setSocketConnection(username) {
    Sock = new SockJS('http://localhost:8080/chat');
    stompClient = over(Sock);
    stompClient.connect({'user': username}, setTimeout(() => {
    }, 500));
}

export const avatarPicture = (userWithAvatar) => {
    if (userWithAvatar.avatar) {
        return "http://localhost:8080/api/media/" + userWithAvatar.avatar.id
    } else {
        return "https://bootdey.com/img/Content/avatar/avatar6.png"
    }
}

const App = observer(() => {
    const {user} = useContext(Context)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setTimeout(() => {
            info().then(data => {
                user.setUser(data.data);
                user.setIsAuth(true);
                setSocketConnection(data.data.username)
                console.log(getToken())
            }).catch()
                .finally(() => setLoading(false))
        },);
    }, [])


    if (loading) {
        return (<div className={"d-flex min-vh-100 align-items-center justify-content-center"}><ReactLoading
            className={"col-md-8 mx-auto h-100"} type={"spinningBubbles"} color={"skyblue"} height={'20vh'}
            width={'20vh'}></ReactLoading></div>)
    } else {
        return (
            <div className="App">
                <BrowserRouter>
                    <Routes>
                        {/*{!user.isAuth && <Route path={"*"} Component={Login}/>}*/}
                        {/*{user.isAuth && <Route path={"*"} Component={ErrorPage}/>}*/}
                        {/*{user.isAuth && <Route path="/" Component={ChatPage}/>}*/}
                        {/*{user.isAuth && <Route path="/home" Component={ChatPage}/>}*/}
                        {/*{user.isAuth && <Route path="/profile" Component={UserProfile}/>}*/}
                        {!user.isAuth && publicRoutes.map(({path, Component}) => <Route path={path}
                                                                                        Component={Component}/>)}
                        {user.isAuth && authRoutes.map(({path, Component}) => <Route path={path}
                                                                                     Component={Component}/>)}
                        {user.isAdmin && <Route path="/admin" Component={AdminPage}/>}
                    </Routes>
                </BrowserRouter>
            </div>

        );
    }
})

export default App;
