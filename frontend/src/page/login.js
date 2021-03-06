import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios"
import { toaster } from "evergreen-ui";

export function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();

    function handleLogin() {
        const query = new FormData();
        query.append("username", username);
        query.append("password", password);
        Axios.post("/login", query)
            .then(res => {
                const data = res.data;
                const status = data.status;
                if (status === 200) {
                    const token = data.data.token;
                    const uid = data.data.uid;
                    localStorage.setItem("Authorization", token);
                    Axios.defaults.headers.Authorization = token;
                    props.login({ username: username, uid: uid });
                    history.push("/")
                    toaster.success(`Welcome, ${username}!`);
                }
            })
            .catch(error => {
                toaster.danger(error.response.data.message);
            })
    }

    return (
        <div className="login-register-page">
            <div className="login-register-content">
                <div style={{textAlign: "center", fontFamily: "Verdana", fontSize: "30px"}}>
                    <label>Sign in to Blog</label>
                </div>
                <hr/>
                <br/>
                <form id="login-form">
                    <div>
                        <label className="input-field-label">Username:</label>
                    </div>
                    <input
                        className="input-field"
                        maxLength="20"
                        required
                        placeholder="Enter username..."
                        onChange={e => setUsername(e.target.value)}
                    />
                    <br/>
                    <div>
                        <label className="input-field-label">Password:</label>
                        <a className="input-field-label" href="/" tabIndex="-1"
                           style={{float: "right", fontSize: "15px", marginTop: "5px"}}>Forgot Password?</a>
                    </div>
                    <input
                        className="input-field"
                        maxLength="20"
                        required
                        placeholder="Enter password..."
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                    />
                </form>
                <br/>
                <button
                    onClick={() => {handleLogin();}}
                    className="login-register-button-primary"
                >Login</button>
                <br/>
                <br/>
                <button
                    onClick={() => { history.push("/registerPage") }}
                    className="login-register-button-secondary"
                >Join Now</button>
            </div>
        </div>
    );
}