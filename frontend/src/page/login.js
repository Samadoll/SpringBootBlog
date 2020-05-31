import React, {useState} from "react";
import axios from "axios"

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function changeState() {
        setUsername("admin");
        setPassword("admin");
        console.log("changed: " + username);
    }

    async function handleLogin() {
        setUsername("admin");
        setPassword("admin");
        const query = new URLSearchParams();
        console.log(username);
        console.log(password);
        query.append("username", username);
        query.append("password", password);
        try {
            const response = await axios.post("/login", query);
            console.log(response);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div>
            <button onClick={() => {changeState();}}>Change</button>
            <button onClick={() => {handleLogin();}}>Test</button>
        </div>
    );
}