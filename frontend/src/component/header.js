import React from "react";
import {useHistory} from "react-router-dom";
import {Avatar, Menu, Popover, Position, toaster} from "evergreen-ui";
import Axios from "axios";

function HeaderButtonGroup(props) {
    const history = useHistory();

    function handleLogOut() {
        Axios.defaults.headers.Authorization = localStorage.getItem("Authorization");
        Axios.post("/api/user/logout");
        localStorage.removeItem("Authorization");
        props.logout();
        history.push("/")
    }

    return props.isLoggedIn
        ? (
            <div className="header-button-group">
                <Popover
                    position={Position.BOTTOM_LEFT}
                    content={
                        <Menu>
                            <Menu.Group>
                                <Menu.Item icon="person">My Account</Menu.Item>
                                <Menu.Item icon="book">My Contents</Menu.Item>
                            </Menu.Group>
                            <Menu.Divider />
                            <Menu.Group>
                                <Menu.Item
                                    icon="key"
                                    intent="danger"
                                    onSelect={() => handleLogOut()}
                                >
                                    Sign Out
                                </Menu.Item>
                            </Menu.Group>
                        </Menu>
                    }
                >
                    <Avatar
                        name={props.userInfo.username}
                        size={40}
                        marginTop="5px"
                    />
                </Popover>
            </div>
        )
        : (
            <div className="header-button-group">
                <button
                    onClick={() => {
                        if (history.location.pathname === "/loginPage") return;
                        history.push("/loginPage");
                    }}
                    className="header-button"
                >Sign In</button>
                <button
                    onClick={() => {
                        if (history.location.pathname === "/registerPage") return;
                        history.push("/registerPage");
                    }}
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
