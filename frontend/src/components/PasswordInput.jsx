export const PasswordInput = () => {
    return (
        <div className="col-12">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" name="password" className="form-control" id="password" required/>
            <div className="invalid-feedback">Please enter your password!</div>
        </div>
    );
};