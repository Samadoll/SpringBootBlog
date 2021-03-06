import React from "react";
import {Content} from "../component/content";
import {useHistory} from "react-router";

export function DisplayContents(props) {
    const history = useHistory();
    const url = props.isMyContent ? "/api/content/myContents" : "/api/content/contents";
    const headers = ["Article", "Author", "Create Time"];
    const headerMapping = {
        idName: "cid",
        Article: { value: "article", type: "custom"},
        Author: { value: "username", type: "text", width: 150, isCentral: true},
        "Create Time": { value: "create_time", type: "date", width: 150, isCentral: true}
    }
    const buttonGroup = [
        {name: "Create Blog", fn: () => history.push("/editContent/0"), enable: props.isLoggedIn},
        {name: "Manage My Blogs", fn: () => history.push("/manageContents"), enable: props.isLoggedIn}
    ]

    function handleSelect(el) {
        history.push("/content/" + el["cid"]);
    }

    return (
        <Content
            isLoggedIn={props.isLoggedIn}
            headers={headers}
            headerMapping={headerMapping}
            buttonGroup={buttonGroup}
            requestUrl={url}
            isMyContent={props.isMyContent}
            rowOnSelect={handleSelect}
        />
    )
}