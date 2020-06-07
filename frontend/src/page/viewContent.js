import React, {useEffect, useState} from "react";
import {TagInput, toaster} from "evergreen-ui";
import {useHistory, useParams} from "react-router";
import Axios from "axios";

function Paragraph(props) {
    let paragraphs = props.content.replaceAll("\r", "").split("\n");
    return (
        <div style={{width: "95%", margin: "auto"}} className={props.className || "readonly-field-textarea"}>
            {paragraphs.filter((el) => el !== "").map((el, index) => <p key={index}>{el}</p>)}
        </div>
    );
}

export function ViewContent(props) {
    const history = useHistory();
    const {id} = useParams();
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [contentBody, setContentBody] = useState("");
    const [author, setAuthor] = useState("Unknown");

    async function fetchContent(id) {
        if (Number(id) === 0) return;
        try {
            const url = "/api/content/" + id;
            const res = await Axios.get(url);
            const status = res.data.status;
            if (status === 200) {
                const data = res.data.data;
                const article = data.article
                setTitle(article.title);
                setContentBody(article.content);
                setTags(data.tags.map((tag) => tag.name));
            } else {
                toaster.danger(res.data.message);
                history.goBack();
            }
        } catch (e) {
            // ignored
        }
    }

    useEffect(() => {
        fetchContent(id);
    }, [id])

    return (
        <div className={"edit-content"}>
            <div style={{textAlign: "center", fontFamily: "Verdana", fontSize: "30px"}}>
                <label>{title}</label>
            </div>
            <hr style={{borderTop: "1px solid #EDF0F2", margin: "15px 10px"}} />
            {/*<div style={{width: "95%", margin: "auto"}}>*/}
            {/*    <textarea*/}
            {/*        className={"readonly-field-textarea"}*/}
            {/*        value={contentBody}*/}
            {/*        readOnly={true}*/}
            {/*    />*/}
            {/*</div>*/}
            <Paragraph content={contentBody} />
            <hr style={{borderTop: "1px solid #EDF0F2"}} />
            <div className={"comment-section"} >
                Comment Section
            </div>
        </div>
    )
}