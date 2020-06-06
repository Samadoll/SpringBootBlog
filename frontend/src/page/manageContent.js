import React, {useState} from "react";
import {useHistory} from "react-router";
import {Content} from "../component/content";

export function ManageContent(props) {
    const history = useHistory()
    const url = "/api/content/myContents";
    const headers = ["Article", "Actions"];
    const headerMapping = {
        idName: "cid",
        Article: { value: "title", type: "text"},
        Actions: {
            value: [
                { name: "Alert", fn: alertEl, enable: true },
                { name: "Edit", fn: edit, enable: true }
            ],
            type: "buttons",
            width: 200,
            isCentral: true
        }
    }
    const buttonGroup = [
        {name: "Create Blog", fn: () => history.push("/editContent/0"), enable: props.isLoggedIn},
        {name: "Delete Selected", fn: () => alert("TODO"), enable: true, className: "table-function-button-danger"}
    ]

    function alertEl(el) {
        console.log(el);
        alert("test");
    }

    function edit(el) {
        history.push("/editContent/" + el["cid"]);
    }

    return (
        <Content
            isLoggedIn={props.isLoggedIn}
            headers={headers}
            headerMapping={headerMapping}
            buttonGroup={buttonGroup}
            requestUrl={url}
            isMyContent={props.isMyContent}
        />
    )
}