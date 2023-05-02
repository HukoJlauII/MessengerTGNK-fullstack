import {Header} from "../components/Header";
import {SideBar} from "../components/SideBar";
import React from "react";
import {Footer} from "../components/Footer";
import {NavLink} from "react-router-dom";

export const Contact = () => {
    return (
        <div>
            <Header/>
            <SideBar />
            <main id="main" className="main">

                <div className="pagetitle">
                    <h1>Контактная информация</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><NavLink to="/home">Главная</NavLink></li>
                            <li className="breadcrumb-item">О нас</li>
                            <li className="breadcrumb-item active">Контактная информация</li>
                        </ol>
                    </nav>
                </div>

                <section className="section contact">

                    <div className="row gy-4">

                        <div className="col-xl-6">

                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="info-box card">
                                        <i className="bi bi-geo-alt"></i>
                                        <h3>Адрес</h3>
                                        <p>Пр. Вернадского 78,<br/>Москва, 119454</p>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="info-box card">
                                        <i className="bi bi-telephone"></i>
                                        <h3>Позвоните нам</h3>
                                        <p>8 985 366 14 11</p>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="info-box card">
                                        <i className="bi bi-envelope"></i>
                                        <h3>Наш Email</h3>
                                        <p>polosatay_zebra@mail.ru</p>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="info-box card">
                                        <i className="bi bi-clock"></i>
                                        <h3>Часы работы</h3>
                                        <p>Понедельник - Пятница<br/>9:00 - 17:00</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="col-xl-6">
                            <div className="card p-4">
                                <form method="post" className="php-email-form">
                                    <div className="row gy-4">

                                        <div className="col-md-6">
                                            <input type="text" name="name" className="form-control"
                                                   placeholder="Ваше имя" required/>
                                        </div>

                                        <div className="col-md-6 ">
                                            <input type="email" className="form-control" name="email"
                                                   placeholder="Ваш Email" required/>
                                        </div>

                                        <div className="col-md-12">
                                            <input type="text" className="form-control" name="subject"
                                                   placeholder="Тема" required/>
                                        </div>

                                        <div className="col-md-12">
                                            <textarea className="form-control" name="message" rows="6"
                                                      placeholder="Сообщение" required/>
                                        </div>

                                        <div className="col-md-12 text-center">
                                            <div className="loading">Loading</div>
                                            <div className="error-message"></div>
                                            <div className="sent-message">Your message has been sent. Thank you!</div>

                                            <button type="submit">Отправить сообщение</button>
                                        </div>

                                    </div>
                                </form>
                            </div>

                        </div>

                    </div>

                </section>

            </main>

            <Footer/>
        </div>
    );
};