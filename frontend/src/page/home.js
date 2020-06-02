import React from 'react';
import {Header} from "../component/header";

export default class Home extends React.Component {
    render() {
        return (
            <div>
                <a href="#">Home Page</a>
                <br/>
                <a href="#/loginPage">To Login Page</a>
            </div>
        )
    }
}