export const FormInput = (props) => {
    return (
        <div className="col-12">
            <label htmlFor={props.name.toLowerCase()} className="form-label">{props.label}</label>
            <div className="input-group has-validation">
                {(props.name === "Username") &&
                    <span className={"input-group-text"} id="inputGroupPrepend">@</span>}
                <input type={chooseInputType(props.name)} name={props.name.toLowerCase()}
                       className={props.error ? "form-control is-invalid" : " form-control"}
                       id={props.name.toLowerCase()}
                       value={props.value}
                       onChange={props.setter}
                />
                <div className="invalid-feedback">{props.error}</div>
            </div>
        </div>
    );
};

function chooseInputType(type) {
    switch (type) {
        case "Password":
        case "Password Confirm":
            return "password";
        case "Email":
            return "email"
        default:
            return "text";
    }
}