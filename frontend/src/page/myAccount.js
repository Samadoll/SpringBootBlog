import React, {useEffect, useState} from "react";
import Axios from "axios";
import {Avatar, toaster} from "evergreen-ui";

export function MyAccount(props) {
    const [info, setInfo] = useState({});
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

    async function fetchUserData() {
        try {
            const res = await Axios.get("/api/user/getInfo");
            const status = res.data.status;
            if (status === 200) {
                const data = res.data.data;
                setInfo(data);
            }
        } catch (err) {
            toaster.danger(err.response.data.message);
            history.goBack();
        }
    }

    useEffect(() => {
        fetchUserData();
    },[])

    function handleChangePassword() {
        if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
            toaster.danger("Please enter valid password.");
            return;
        }
        if (newPassword !== confirmPassword) {
            toaster.danger("Password Not Match");
            return;
        }

        const loginQuery = new FormData();
        loginQuery.append("username", props.userInfo.username);
        loginQuery.append("password", oldPassword);
        Axios.post("/login", loginQuery)
            .then(res => {
                const data = res.data;
                const status = data.status;
                if (status === 200) {
                    const token = data.data.token;
                    localStorage.setItem("Authorization", token);
                    Axios.defaults.headers.Authorization = token;
                    const query = new FormData();
                    query.append("password", newPassword);
                    Axios.put("/api/user/password", query)
                        .then((res) => {
                            const data = res.data;
                            const status = data.status;
                            if (status === 200) {
                                toaster.success("Password is changed. Please login.");
                                props.logout();
                            }
                        })
                        .catch((err) => {
                            toaster.danger(err.response.data.message);
                        })
                }
            })
            .catch(error => {
                toaster.danger(error.response.data.message);
            })
    }

    return (
        <div className="table-content">
            <div style={{
                height: "auto",
                textAlign: "center",
                fontFamily: "Verdana",
                padding: 20,
                width: "80%",
                margin: "auto",
                fontSize: 20
            }}>
                <Avatar
                    name={info.username}
                    size={100}
                    marginTop="5px"
                />
                <br/>
                <label>{info.username}</label>
                <br/>
                <label>Joined: {new Date(info["registerTime"]).toLocaleString().split(",")[0]}</label>
                <hr style={{borderTop: "1px solid #EDF0F2"}} />
                <div style={{
                    width: "50%",
                    margin: "10px auto"
                }}>
                    {
                        !showChangePasswordForm
                            ? (
                                <button
                                    onClick={() => setShowChangePasswordForm(true)}
                                    className="login-register-button-primary"
                                >Change Password</button>
                            )
                            : (
                                <div>
                                    <form>
                                        <div>
                                            <label className="input-field-label">Old Password:</label>
                                        </div>
                                        <input
                                            className="input-field"
                                            maxLength="20"
                                            required
                                            placeholder="Enter Old Password..."
                                            type="password"
                                            onChange={e => setOldPassword(e.target.value)}
                                        />
                                        <br/>
                                        <div>
                                            <label className="input-field-label">New Password:</label>
                                        </div>
                                        <input
                                            className="input-field"
                                            maxLength="20"
                                            required
                                            placeholder="Enter New Password..."
                                            type="password"
                                            onChange={e => setNewPassword(e.target.value)}
                                        />
                                        <br/>
                                        <div>
                                            <label className="input-field-label">Confirm Password:</label>
                                        </div>
                                        <input
                                            className="input-field"
                                            maxLength="20"
                                            required
                                            placeholder="Re-Enter Password..."
                                            type="password"
                                            onChange={e => setConfirmPassword(e.target.value)}
                                        />
                                    </form>
                                    <br/>
                                    <button
                                        style={{marginBottom: 10}}
                                        onClick={() => handleChangePassword()}
                                        className="login-register-button-primary"
                                    >Submit</button>
                                    <button
                                        onClick={() => {
                                            setShowChangePasswordForm(false);
                                            setOldPassword("");
                                            setNewPassword("");
                                            setConfirmPassword("");
                                        }}
                                        className="login-register-button-secondary"
                                    >Cancel</button>
                                </div>
                            )
                    }
                </div>
            </div>
        </div>
    )
}