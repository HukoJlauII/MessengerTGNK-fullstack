import {Route, Routes} from 'react-router-dom'
import {authRoutes, publicRoutes} from "../routes";
import {useContext} from "react";
import {Context} from "../index";
import {ChatPage} from "../pages/ChatPage";
import {observer} from "mobx-react-lite";

export const ChatRouter = observer(() => {

    const {user} = useContext(Context)
    console.log(user.isAuth)
    const authRouteList = authRoutes.map(({path, Component}) =>
        <Route key={path} path={path} Component={Component}/>)
    return (
        <Routes>
            {user.isAuth && <Route key={"/home"} path={"/home"} Component={ChatPage}/>}
            {
                publicRoutes.map(({path, Component}) =>
                    <Route key={path} path={path} Component={Component}/>)
            }

        </Routes>
    );
});