import {Header} from "../components/Header";
import {SideBar} from "../components/SideBar";
import {NavLink} from "react-router-dom";
import {Footer} from "../components/Footer";
import React, {useEffect, useState} from "react";
import {allUsers, deleteUser} from "../http/userAPI";
import ReactLoading from "react-loading";
import {avatarPicture} from "../App";

export const AdminPage = () => {

    const [loading, setLoading] = useState(true);

    const [users, setUsers] = useState();
    useEffect(() => {
        setTimeout(() => {
            allUsers().then(data => {
                setUsers(data.data._embedded.users)
                console.log(data.data._embedded.users)
            }).finally(() => setLoading(false))
        },);
    }, [])

    const removeUser = async (event, id) => {
        const table = event.target.parentNode.parentNode.parentNode
        const tr = event.target.parentNode.parentNode
        await deleteUser(id).then(() => table.removeChild(tr))
    }

    if (loading) {
        return (<div className={"d-flex min-vh-100 align-items-center justify-content-center"}><ReactLoading
            className={"col-md-8 mx-auto h-100"} type={"spinningBubbles"} color={"skyblue"} height={'20vh'}
            width={'20vh'}></ReactLoading></div>)
    } else {
        return (
            <div>
                <Header/>

                <SideBar admin={true}/>

                <main id="main" className="main">

                    <div className="pagetitle">
                        <h1>Админ панель</h1>
                        <nav>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><NavLink to="/">Главная</NavLink></li>
                                <li className="breadcrumb-item active">Админ панель</li>
                            </ol>
                        </nav>
                    </div>

                    <section className="section dashboard">
                        <div className="row">


                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Список пользователей</h5>


                                        <table className="table table-dark text-center">
                                            <thead>
                                            <tr>
                                                <th scope="col">Аватар</th>
                                                <th scope="col">Никнейм</th>
                                                <th scope="col">Полное имя</th>
                                                <th scope="col">Почта</th>
                                                <th scope="col">Дата регистрации</th>
                                                <th scope="col">Действия</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {users.map(user => {
                                                return (
                                                    <tr>
                                                        <td scope="col"><img src={avatarPicture(user)}
                                                                             style={{height: '50px', width: '50px'}}
                                                                             alt="Profile"
                                                                             className="rounded-circle"/></td>
                                                        <td scope="row">{user.username}</td>
                                                        <td>{user.surname + ' ' + user.name}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.registrationDate}</td>
                                                        {user.roles.includes('ROLE_ADMIN') && <td></td>}
                                                        {!user.roles.includes('ROLE_ADMIN') &&
                                                            <td><span className="btn btn-danger"
                                                                      onClick={(event) => removeUser(event, user.id)}>Удалить уч. запись</span>
                                                            </td>}
                                                    </tr>)
                                            })}
                                            npm {/*<tr>*/}
                                            {/*    <th scope="row">1</th>*/}
                                            {/*    <td>Brandon Jacob</td>*/}
                                            {/*    <td>Designer</td>*/}
                                            {/*    <td>28</td>*/}
                                            {/*    <td>2016-05-25</td>*/}
                                            {/*</tr>*/}
                                            {/*<tr>*/}
                                            {/*    <th scope="row">2</th>*/}
                                            {/*    <td>Bridie Kessler</td>*/}
                                            {/*    <td>Developer</td>*/}
                                            {/*    <td>35</td>*/}
                                            {/*    <td>2014-12-05</td>*/}
                                            {/*</tr>*/}
                                            {/*<tr>*/}
                                            {/*    <th scope="row">3</th>*/}
                                            {/*    <td>Ashleigh Langosh</td>*/}
                                            {/*    <td>Finance</td>*/}
                                            {/*    <td>45</td>*/}
                                            {/*    <td>2011-08-12</td>*/}
                                            {/*</tr>*/}
                                            {/*<tr>*/}
                                            {/*    <th scope="row">4</th>*/}
                                            {/*    <td>Angus Grady</td>*/}
                                            {/*    <td>HR</td>*/}
                                            {/*    <td>34</td>*/}
                                            {/*    <td>2012-06-11</td>*/}
                                            {/*</tr>*/}
                                            {/*<tr>*/}
                                            {/*    <th scope="row">5</th>*/}
                                            {/*    <td>Raheem Lehner</td>*/}
                                            {/*    <td>Dynamic Division Officer</td>*/}
                                            {/*    <td>47</td>*/}
                                            {/*    <td>2011-04-19</td>*/}
                                            {/*</tr>*/}
                                            </tbody>
                                        </table>


                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>

                </main>
                <Footer/>
                {/*<BackToTop/>*/}
            </div>
        );
    }
}