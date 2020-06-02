import React, { useState, useEffect } from "react";
import {HashRouter, Switch, Route } from "react-router-dom";
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

    // async function initialFetch() {
    //     Axios.defaults.headers.Authorization = localStorage.getItem("Authorization") || "";
    //     await Axios.get("/api/user/checkAuth")
    //             .then((res) => {
    //                 const status = res.status;
    //                 if (status === 200) {
    //                     setUserInfo(res.data);
    //                     setIsLoggedIn(true);
    //                 }
    //                 setIsLoading(false);
    //             })
    //             .catch((e) => {
    //                 setIsLoading(false);
    //             })
    // }

    // useEffect(() => {
    //     setIsLoading(true);
    //     initialFetch();
    // })

    // return isLoading
    //     ? (
    //         <div className="loading-container">
    //             <div className="opblock-loading-animation">
    //                 <Spinner marginX="auto" size={100}/>
    //             </div>
    //         </div>
    //     )
    //     : (
    //         <HashRouter>
    //             <Header
    //                 isLoggedIn={isLoggedIn}
    //                 userInfo={userInfo}
    //                 logout={logout}
    //             />
    //             <div className="content">
    //                 <Switch>
    //                     <Route exact path="/" component={Home}/>
    //                     <Route path="/loginPage">
    //                         <Login login={login} />
    //                     </Route>
    //                     <Route exact path="/registerPage" component={Register}/>
    //                 </Switch>
    //             </div>
    //         </HashRouter>
    //     );

    return (
        <HashRouter>
            <Header
                isLoggedIn={isLoggedIn}
                userInfo={userInfo}
                logout={logout}
            />
            <div className="content">
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/loginPage">
                        <Login login={login} />
                    </Route>
                    <Route exact path="/registerPage" component={Register}/>
                </Switch>
            </div>
        </HashRouter>
    )
}