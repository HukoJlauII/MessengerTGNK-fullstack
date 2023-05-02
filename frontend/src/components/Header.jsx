import {NavLink} from "react-router-dom";
import logo from "../assets/img/logo.png";
import dayjs from "dayjs";
import {useContext} from "react";
import {Context} from "../index";
import {Sock} from "../pages/Login";


export const Header = () => {
    const {user} = useContext(Context)
    const logoutUser = () => {
        localStorage.removeItem('token')
        user.setUser({})
        user.setIsAuth(false)
        Sock.close()

    }
    return (
        <header id="header" className="header fixed-top d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-between">
                <NavLink to="/home" className="logo d-flex align-items-center">
                    <img src={logo} alt=""/>
                    <span className="d-none d-lg-block">TGNKMessage</span>
                </NavLink>
                <i className="bi bi-list toggle-sidebar-btn" onClick={() =>
                    document.querySelector('body').classList.toggle('toggle-sidebar')}></i>
            </div>


            <nav className="header-nav ms-auto">
                <ul className="d-flex align-items-center">


                    <li className="nav-item dropdown pe-3">

                        <NavLink className="nav-link nav-profile d-flex align-items-center pe-0" to="#"
                                 data-bs-toggle="dropdown">
                            <img src={user.avatarPicture} alt="Profile"
                                 className="rounded-circle" style={{width: '36px'}}/>
                            <span className="d-none d-md-block dropdown-toggle ps-2">{user.user.username}</span>
                        </NavLink>

                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                            <li className="dropdown-header">
                                <h6>{user.user.name + ' ' + user.user.surname}</h6>
                                <span>Зарегистрирован с {dayjs(user.user.registrationDate).format('DD MMMM YYYY')}</span>
                            </li>
                            <li>
                                <hr className="dropdown-divider"/>
                            </li>

                            <li>
                                <NavLink className="dropdown-item d-flex align-items-center" to="/profile">
                                    <i className="bi bi-person"></i>
                                    <span>Личный кабинет</span>
                                </NavLink>
                            </li>
                            <li>
                                <hr className="dropdown-divider"/>
                            </li>

                            <li>
                                <NavLink className="dropdown-item d-flex align-items-center"
                                         to="/profile#edit-profile">
                                    <i className="bi bi-gear"></i>
                                    <span>Изменить данные</span>
                                </NavLink>
                            </li>
                            <li>
                                <hr className="dropdown-divider"/>
                            </li>

                            <li>
                                <NavLink className="dropdown-item d-flex align-items-center" onClick={logoutUser}
                                         to="/login">
                                    <i className="bi bi-box-arrow-right"></i>
                                    <span>Выйти</span>
                                </NavLink>
                            </li>

                        </ul>

                    </li>


                </ul>
            </nav>


        </header>
    );
};