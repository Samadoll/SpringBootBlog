import React, {useEffect, useState} from "react";
import {Badge, Dialog, toaster} from "evergreen-ui";
import {useHistory, useParams} from "react-router";
import Axios from "axios";
import {ButtonGroup} from "../component/buttonGroup";
import {CommentSection} from "../component/commentSection";

function Paragraph(props) {
    let paragraphs = props.content.replace(/(\r)/g, "").split("\n");
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
    const [buttonGroup, setButtonGroup] = useState([]);
    const [author, setAuthor] = useState("Unknown");
    const [createTime, setCreateTIme] = useState("");

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
                setButtonGroup([
                    {name: "Back", fn: () => history.goBack(), enable: true},
                    {name: "Edit", fn: handleEdit, enable: article["authorId"] === props.userInfo.uid, requiredParam: true}
                ])
                setAuthor(article.username);
                setCreateTIme(new Date(article["create_time"]).toDateString())
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

    function handleEdit(id) {
        history.push("/editContent/" + id)
    }

    return (
        <div className={"edit-content"}>
            <div>
                <ButtonGroup
                    groupClass={"table-function-button-group"}
                    buttonClass={"table-function-button"}
                    buttonGroup={buttonGroup}
                    targetParam={[id]}
                />
                <br/><br/>
                <div style={{textAlign: "center", fontFamily: "Verdana", fontSize: "30px"}}>
                    <label>{title}</label>
                </div>
                <div style={{textAlign: "center", fontFamily: "Verdana", fontSize: "15px", color: "#888888", marginTop: 5}}>
                    <label>By {author}</label>
                    <br/>
                    {createTime === "" ? null : <label>{createTime}</label>}
                </div>
            </div>
            <div style={{width: "98%", margin: "10px auto", textAlign: "center"}}>
                {tags.map((tag, index) => <Badge key={index} color="blue" margin={4}>{tag}</Badge>)}
            </div>
            <hr style={{borderTop: "1px solid #EDF0F2", margin: "5px 10px"}} />
            <Paragraph content={contentBody} />
            <hr style={{borderTop: "1px solid #EDF0F2"}} />
            <CommentSection contentId={id} isLoggedIn={props.isLoggedIn} />
        </div>
    )
}