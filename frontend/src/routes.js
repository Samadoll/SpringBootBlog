import React, { useState } from "react";
import {HashRouter, Switch, Route } from "react-router-dom";
import Home from "./page/home"
import { Login } from "./page/login";
import { Register } from "./page/register";
import {Header} from "./component/header";

export function Routes() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <HashRouter>
            <Header />
            <div className="content">
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/loginPage" component={Login} />
                    <Route exact path="/registerPage" component={Register}/>
                </Switch>
            </div>
        </HashRouter>
    );
}