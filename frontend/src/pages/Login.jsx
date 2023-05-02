import {FormInput} from "../components/FormInput";
import logo from "../assets/img/logo.png"
import {FormButton} from "../components/FormButton";
import {RememberMe} from "../components/RememberMe";
import {NavLink, useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {useContext, useState} from "react";
import {Context} from "../index";
import {login} from "../http/userAPI";
import {setSocketConnection} from "../App";

export const Login = observer(() => {
    const {user} = useContext(Context)
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();
    const [passwordError, setPasswordError] = useState();
    const [loading, setLoading] = useState(false);


    const signIn = async () => {
        setLoading(true)
        await login(username, password).then((res) => {
                user.setUser(res.user)
                user.setIsAuth(true)
                setSocketConnection(res.user.username)
                navigate('/home')
            }
        ).catch(e => {
            console.log(e)
            setPasswordError('Неверное имя пользователя или пароль')
        }).finally(() => setLoading(false))
    }


    return (
        <div>
            <main>
                <div className="container">
                    <section
                        className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div
                                    className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                                    <div className="d-flex justify-content-center py-4">
                                        <a href="/" className="logo d-flex align-items-center w-auto">
                                            <img src={logo} alt="logo"/>
                                            <span className="d-none d-lg-block">TGNKMessage</span>
                                        </a>
                                    </div>


                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <div className="pt-4 pb-2">
                                                <h5 className="card-title text-center pb-0 fs-4">Войдите в свою учетную
                                                    запись</h5>
                                                <p className="text-center small">Введите своё имя пользователя и пароль
                                                    для входа в систему</p>
                                            </div>
                                            <div className="row g-3 needs-validation">
                                                <FormInput name={"Username"} label={"Имя пользователя"} value={username}
                                                           setter={e => setUsername(e.target.value)}/>
                                                <FormInput name={"Password"} label={"Пароль"} value={password}
                                                           setter={e => setPassword(e.target.value)}
                                                           error={passwordError}/>
                                                <RememberMe/>
                                                <FormButton action={"Войти"} submit={signIn} loading={loading}/>
                                                <div className="col-12">
                                                    <p className="small mb-0">У вас нет учетной записи? <NavLink
                                                        to="/register">Создайте аккаунт</NavLink></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="credits">
                            Разработано <a href="https://github.com/HukoJlauII">HukoJlauII</a>
                        </div>
                    </section>
                </div>
            </main>

        </div>
    );
})