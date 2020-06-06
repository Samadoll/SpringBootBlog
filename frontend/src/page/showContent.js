import React from "react";
import {Content} from "../component/content";
import {useHistory} from "react-router";

export function ShowContent(props) {
    const history = useHistory();
    const url = props.isMyContent ? "/api/content/myContents" : "/api/content/contents";
    const headers = ["Article", "Author", "Create Time"];
    const headerMapping = {
        idName: "cid",
        Article: { value: "title", type: "text"},
        Author: { value: "username", type: "text", width: 150},
        "Create Time": { value: "create_time", type: "date", width: 150}
    }
    const buttonGroup = [
        {name: "Create Blog", fn: () => history.push("/editContent/0"), enable: props.isLoggedIn},
        {name: "Manage My Blogs", fn: () => history.push("/manageContents"), enable: props.isLoggedIn}
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