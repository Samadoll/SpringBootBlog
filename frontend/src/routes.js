import React, { useState, useEffect } from "react";
import {HashRouter, Switch, Route, Redirect} from "react-router-dom";
import { Content } from "./component/content"
import { Login } from "./page/login";
import { Register } from "./page/register";
import { Header } from "./component/header";
import Axios from "axios";
import { Spinner } from "evergreen-ui";
import { EditContent } from "./page/editContent";
import { ManageContents } from "./page/manageContents";
import { DisplayContents } from "./page/displayContents";
import { ViewContent } from "./page/viewContent";
import { About } from "./page/about";
import {MyAccount} from "./page/myAccount";

function ProtectedRoute(props) {
    return (
        <Route exact path={props.path} >
            {
                props.condition ? (props.target) : (<Redirect to="/" />)
            }
        </Route>
    )
}

export function Routes() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({
        username: "",
        uid: 0
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
            username: "",
            uid: 0
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
                    setUserInfo({
                        username: res.data.data.username,
                        uid: res.data.data.uid
                    });
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
                                    <DisplayContents isMyContent={false} isLoggedIn={isLoggedIn} />
                                </Route>
                                <Route exact path="/myContents" >
                                    {
                                        isLoggedIn ? (<DisplayContents isMyContent={true} isLoggedIn={isLoggedIn} />) : (<Redirect to="/" />)
                                    }
                                </Route>
                                <Route exact path="/manageContents" >
                                    {
                                        isLoggedIn ? (<ManageContents isMyContent={true} isLoggedIn={isLoggedIn} />) : (<Redirect to="/" />)
                                    }
                                </Route>
                                <Route exact path="/myAccount" >
                                    {
                                        isLoggedIn ? (<MyAccount isLoggedIn={isLoggedIn} userInfo={userInfo} logout={logout} />) : (<Redirect to="/" />)
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
                                <Route exact path="/editContent/:id" >
                                    {
                                        isLoggedIn ? (<EditContent isLoggedIn={isLoggedIn}/>) : (<Redirect to="/" />)
                                    }
                                </Route>
                                <Route exact path="/content/:id" >
                                    <ViewContent isLoggedIn={isLoggedIn} userInfo={userInfo}/>
                                </Route>
                                {/*<ProtectedRoute path={"/myContents"} condition={isLoggedIn} target={<DisplayContents isMyContent={true} isLoggedIn={isLoggedIn} />} />*/}
                                {/*<ProtectedRoute path={"/manageContents"} condition={isLoggedIn} target={<ManageContents isMyContent={true} isLoggedIn={isLoggedIn} />} />*/}
                                {/*<ProtectedRoute path={"/loginPage"} condition={!isLoggedIn} target={<Login login={login} />} />*/}
                                {/*<ProtectedRoute path={"/registerPage"} condition={!isLoggedIn} target={<DisplayContents isMyContent={true} isLoggedIn={isLoggedIn} />} />*/}
                                {/*<ProtectedRoute path={"/editContent/:id"} condition={isLoggedIn} target={<EditContent isLoggedIn={isLoggedIn}/>} />*/}
                                <Route exact path="/about" component={About} />
                            </Switch>
                        )
                }
            </div>
        </HashRouter>
    );
}
