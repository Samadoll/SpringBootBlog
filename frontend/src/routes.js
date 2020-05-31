import React, { useState } from "react";
import {HashRouter, Switch, Route } from "react-router-dom";
import Home from "./page/home"
import {Login} from "./page/login";
import Register from "./page/register";

export function Routes(props) {
    return (
        <HashRouter>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/loginPage">
                    <Login />
                </Route>
                <Route exact path="/registerPage" component={Register}/>
            </Switch>
        </HashRouter>
    );
}