import {NavLink} from "react-router-dom";

export const BackToTop = () => {
    return (
        <NavLink href="#" className="back-to-top d-flex align-items-center justify-content-center"><i
            className="bi bi-arrow-up-short"></i></NavLink>
    );
};