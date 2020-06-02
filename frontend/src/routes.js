import React, { useState, useEffect } from "react";
import {HashRouter, Switch, Route, Redirect} from "react-router-dom";
import Home from "./page/home"
import { Login } from "./page/login";
import { Register } from "./page/register";
import {Header} from "./component/header";
import Axios from "axios";
import {Spinner} from "evergreen-ui";

export function Routes() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({
        username: ""
    });
    const [isLoading, setIsLoading] = useState(true)

    function login(userInfo) {
        setIsLoggedIn(true);
        setUserInfo(userInfo);
    }

    function logout() {
        setUserInfo({
            username: ""
        });
        setIsLoggedIn(false);
    }

    async function initialFetch() {
        const token = localStorage.getItem("Authorization") || "";
        if (token !== "") {
            try {
                Axios.defaults.headers.Authorization = localStorage.getItem("Authorization") || "";
                const res = await Axios.get("/api/user/checkAuth");
                const status = res.status;
                if (status === 200) {
                    setUserInfo({username: res.data.data.username});
                    setIsLoggedIn(true);
                }
            } catch (e) {
                // ignored
            }
        }
        setIsLoading(false);
    }

    useEffect(() => {
        initialFetch();
    }, [])

    return (
        <HashRouter>
            <Header
                isLoggedIn={isLoggedIn}
                userInfo={userInfo}
                logout={logout}
            />
            <div className="content">
                {
                    isLoading
                        ? (
                            <div className="loading-container">
                                <div className="opblock-loading-animation">
                                    <Spinner marginX="auto" size={100}/>
                                </div>
                            </div>
                        )
                        : (
                            <Switch>
                                <Route exact path="/" component={Home}/>
                                <Route path="/loginPage">
                                    {
                                        isLoggedIn ? (<Redirect to="/" />) : (<Login login={login} />)
                                    }
                                </Route>
                                <Route exact path="/registerPage" >
                                    {
                                        isLoggedIn ? (<Redirect to="/" />) : (<Register />)
                                    }
                                </Route>
                            </Switch>
                        )
                }
            </div>
        </HashRouter>
    );
}