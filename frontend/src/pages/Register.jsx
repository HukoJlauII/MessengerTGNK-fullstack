import logo from "../assets/img/logo.png";
import {FormInput} from "../components/FormInput";
import {NavLink, useNavigate} from "react-router-dom";
import {registration} from "../http/userAPI";
import {useState} from "react";
import {FormButton} from "../components/FormButton";

export function Register() {

    const [name, setName] = useState()
    const [surname, setSurname] = useState();
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordConfirm, setPasswordConfirm] = useState();
    const [nameError, setNameError] = useState()
    const [surnameError, setSurnameError] = useState();
    const [usernameError, setUsernameError] = useState();
    const [emailError, setEmailError] = useState();
    const [passwordError, setPasswordError] = useState();
    const [passwordConfirmError, setPasswordConfirmError] = useState();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const signUp = async () => {
        setLoading(true)
        await registration(name, surname, username, email, password, passwordConfirm)
            .then((res) => {
                    navigate('/login')
                    console.log(res)
                }
            )
            .catch((err) => {
                    setLoading(false)
                    err.response.data.forEach(fieldError => {
                        switch (fieldError.field) {
                            case 'name': {
                                setNameError(fieldError.defaultMessage)
                                break;
                            }
                            case 'surname': {
                                setSurnameError(fieldError.defaultMessage)
                                break;
                            }
                            case 'username': {
                                setUsernameError(fieldError.defaultMessage)
                                break;
                            }
                            case 'email': {
                                setEmailError(fieldError.defaultMessage)
                                break;
                            }
                            case 'password': {
                                setPasswordError(fieldError.defaultMessage)
                                break;
                            }
                            case 'passwordConfirm': {
                                setPasswordConfirmError(fieldError.defaultMessage)
                                break;
                            }
                        }
                    })


                }
            )
    }

    return (
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
                                            <h5 className="card-title text-center pb-0 fs-4">Создайте аккаунт</h5>
                                            <p className="text-center small">Введите свои личные данные для создания
                                                учетной записи</p>
                                        </div>
                                        <div className="row g-3 needs-validation">
                                            <FormInput name={"Name"} label={"Имя"} value={name} error={nameError}
                                                       setter={e => setName(e.target.value)}/>
                                            <FormInput name={"Surname"} label={"Фамилия"} value={surname}
                                                       error={surnameError}
                                                       setter={e => setSurname(e.target.value)}/>
                                            <FormInput name={"Email"} label={"Почта"} value={email} error={emailError}
                                                       setter={e => setEmail(e.target.value)}/>
                                            <FormInput name={"Username"} label={"Имя пользователя"} value={username}
                                                       error={usernameError}
                                                       setter={e => setUsername(e.target.value)}/>
                                            <FormInput name={"Password"} label={"Пароль"} value={password}
                                                       error={passwordError}
                                                       setter={e => setPassword(e.target.value)}/>
                                            <FormInput name={"Password Confirm"} label={"Подтверждение пароля"}
                                                       value={passwordConfirm}
                                                       error={passwordConfirmError}
                                                       setter={e => setPasswordConfirm(e.target.value)}/>
                                            <FormButton action={"Создать аккаунт"} submit={signUp} loading={loading}/>
                                            <div className="col-12">
                                                <p className="small mb-0">Уже есть аккаунт? <NavLink
                                                    to="/login">Войдите</NavLink></p>
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
    );
}