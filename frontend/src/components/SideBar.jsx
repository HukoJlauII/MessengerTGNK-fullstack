import {NavLink, useLocation} from "react-router-dom";
import {useContext} from "react";
import {Context} from "../index";

export const SideBar = () => {
    const location = useLocation()
    const {user} = useContext(Context)
    return (
        <aside id="sidebar" className="sidebar">

            <ul className="sidebar-nav" id="sidebar-nav">
                <li className="nav-heading">Страницы</li>
                <li className="nav-item">
                    <NavLink className={location.pathname === '/home' ? 'nav-link' : 'nav-link collapsed'} to="/home">
                        <i className="bi bi-chat"></i>
                        <span>Сообщения</span>
                    </NavLink>
                </li>


                <li className="nav-item">
                    <NavLink className={location.pathname === '/profile' ? 'nav-link' : 'nav-link collapsed'}
                             to="/profile">
                        <i className="bi bi-person"></i>
                        <span>Личный кабинет</span>
                    </NavLink>
                </li>
                {user.isAdmin &&
                    <li className="nav-item">
                        <NavLink className={location.pathname === '/admin' ? 'nav-link' : 'nav-link collapsed'}
                                 to="/admin">
                            <i className="bi bi-menu-button-wide"></i>
                            <span>Админ панель</span>
                        </NavLink>
                    </li>}
            </ul>
        </aside>
    );
};
