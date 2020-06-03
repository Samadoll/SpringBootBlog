import React, { useState, useEffect } from "react";
import {HashRouter, Switch, Route, Redirect} from "react-router-dom";
import { Content } from "./page/content"
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
        localStorage.removeItem("Authorization");
        delete Axios.defaults.headers.Authorization;
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
                } else {
                    logout();
                }
            } catch (e) {
                logout();
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
                                <Route exact path="/" >
                                    <Content userInfo={userInfo} />
                                </Route>
                                <Route exact path="/myContents" >
                                    {
                                        isLoggedIn ? (<Content userInfo={userInfo} />) : (<Redirect to="/" />)
                                    }
                                </Route>
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
                                <Route exact path="/about" component={Content} />
                            </Switch>
                        )
                }
            </div>
        </HashRouter>
    );
}