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
        Actions: { value: "create_time", type: "date", width: 150}
    }
    const buttonGroup = [
        {name: "Delete Selected", fn: () => alert("TODO"), enable: true, className: "table-function-button-danger"}
    ]

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