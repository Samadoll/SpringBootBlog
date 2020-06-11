import React from "react";
import {useHistory} from "react-router-dom";
import {Avatar, Menu, Popover, Position, toaster} from "evergreen-ui";
import Axios from "axios";

function HeaderButtonGroup(props) {
    const history = useHistory();

    function handleLogOut() {
        Axios.defaults.headers.Authorization = localStorage.getItem("Authorization");
        Axios.post("/api/user/logout");
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
                                <Menu.Item icon="person" onSelect={() => history.push("/myAccount")}>My Account</Menu.Item>
                                <Menu.Item icon="book" onSelect={() => history.push("/manageContents")}>Manage My Contents</Menu.Item>
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
    const pages = [
            {name: "Home", href: "#/", loginRequired: false},
            {name: "My Contents", href: "#/myContents", loginRequired: true},
            {name: "About", href: "#/about", loginRequired: false}
        ];
    return (
        <div id="header" className="sticky-header">
            {
                pages.filter(page => !page.loginRequired || page.loginRequired === props.isLoggedIn)
                    .map(page =>
                        <div key={page.name} className="header-pages">
                            <a href={page.href}>
                                <label>{page.name}</label>
                            </a>
                        </div>
                    )
            }
            <HeaderButtonGroup {...props} />
        </div>
    )
}
