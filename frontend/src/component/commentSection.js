import React, {useEffect, useState} from "react";
import {Dialog} from "evergreen-ui";
import Axios from "axios";

export function CommentSection(props) {
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    async function fetchComment() {
        try {
            const url = "/api/getComments/" + props.contentId;
            const res = await Axios.get(url);
        } catch(err) {
            // ignored
        }
    }

    useEffect(() => {
        fetchComment();
    }, [props.contentId])

    function handleSubmitComment() {
        alert(props.contentId + ":" + comment);
    }

    return (
        <div className={"comment-section"} >
            <Dialog
                preventBodyScrolling={true}
                isShown={showCommentBox}
                title={"Comment"}
                onCloseComplete={() => setShowCommentBox(false)}
                onConfirm={() => handleSubmitComment()}
                confirmLabel={"Replay"}
            >
                <div style={{height: "100%"}}>
                    <textarea
                        placeholder={"Leave a comment..."}
                        onChange={event => setComment(event.target.value)}
                        style={{
                            width: "calc(100% - 12px)",
                            resize: "vertical",
                            minHeight: "150px",
                            padding: "5px",
                            fontSize: "120%",
                            border: "1px solid #CCCCCC"
                        }}
                    />
                </div>
            </Dialog>
            <div className={"comment-section-header"}>
                <div className={"comment-section-header-label"}>
                    <label>Comments</label>
                </div>
                <div className={"comment-section-header-button-group"} style={{float: "right !important"}}>
                    <button
                        onClick={() => setShowCommentBox(true)}
                        disabled={!props.isLoggedIn}
                        className={"table-function-button" + (props.isLoggedIn ? "" : " button-disabled")}
                    >Leave A Comment</button>
                </div>
            </div>
            <hr style={{borderTop: "1px solid #EDF0F2"}} />
        </div>
    )
}