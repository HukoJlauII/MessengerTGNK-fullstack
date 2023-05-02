import errorImage from "../assets/img/not-found.svg"
import {NavLink} from "react-router-dom";

export const ErrorPage = () => {
    return (
        <main>
            <div className="container">

                <section
                    className="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                    <h1>404</h1>
                    <h2>The page you are looking for doesn't exist.</h2>
                    <a className="btn" href="/home">Back to home</a>
                    <img src={errorImage} className="img-fluid py-5" alt="Page Not Found"/>
                    <div className="credits">
                        Designed by <NavLink href="https://github.com/HukoJlauII">HukoJlauII</NavLink>
                    </div>
                </section>
            </div>
        </main>
    );
};