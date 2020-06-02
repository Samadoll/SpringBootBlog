import React, { useState } from "react";
import { useHistory } from "react-router-dom";

function HeaderButtonGroup(props) {
    const history = useHistory();

    let loggedIn = false;

    function handleLogOut() {
        localStorage.removeItem("Authorization");
        history.push("#/home")
    }

    return loggedIn
        ? (
            <label >Test</label>
        )
        : (
            <div className="header-button-group">
                <button
                    onClick={() => { history.push("/loginPage") }}
                    className="header-button"
                >Sign In</button>
                <button
                    onClick={() => { history.push("/registerPage") }}
                    className="header-button"
                >Sign Up</button>
            </div>
        )
}

export function Header(props) {

    return (
        <div id="header" className="sticky-header">
            <div className="header-pages">
                <a href="#/">
                    <label>Home</label>
                </a>
            </div>
            <div className="header-pages">
                <a href="#/">
                    <label>Contents</label>
                </a>
            </div>
            <HeaderButtonGroup {...props} />
        </div>
    )
}
