import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios"
import { toaster } from "evergreen-ui";

export function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("")
    const history = useHistory();

    function handleRegister() {
        if (confirm !== password) {
            toaster.danger("Password Not Match");
            return;
        }
        const query = new URLSearchParams();
        query.append("username", username);
        query.append("password", password);
        Axios.post("/api/register", query)
            .then(res => {
                const data = res.data;
                const status = data.status;
                if (status === 200) {
                    history.push("#/loginPage")
                    toaster.success(data.message);
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
                    <label>Create Your Account</label>
                </div>
                <hr/>
                <br/>
                <form>
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
                    </div>
                    <input
                        className="input-field"
                        maxLength="20"
                        required
                        placeholder="Enter password..."
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                    />
                    <br/>
                    <div>
                        <label className="input-field-label">Confirm Password:</label>
                    </div>
                    <input
                        className="input-field"
                        maxLength="20"
                        required
                        placeholder="Re-enter password..."
                        type="password"
                        onChange={e => setConfirm(e.target.value)}
                    />
                </form>
                <br/>
                <button
                    onClick={() => {handleRegister();}}
                    className="login-register-button-primary"
                >Register</button>
                <br/>
                <br/>
                <button
                    onClick={() => { history.push("/loginPage") }}
                    className="login-register-button-secondary"
                >Sign In Now</button>
            </div>
        </div>
    );
}