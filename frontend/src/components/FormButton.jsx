export function FormButton(props) {
    return (
        <div className="col-12">
            {(!props.loading &&
                <button className="btn btn-primary w-100" onClick={props.submit}>{props.action}</button>)}
            {(props.loading && <button className="btn btn-primary w-100" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...
            </button>)}
        </div>
    );
}