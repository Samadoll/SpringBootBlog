import React, {useEffect, useState} from "react";
import {Dialog, toaster} from "evergreen-ui";
import Axios from "axios";

export function CommentSection(props) {
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [triggerUpdate, setTriggerUpdate] = useState(true);

    async function fetchComment() {
        try {
            const url = "/api/comment/getComments?contentId=" + props.contentId;
            const res = await Axios.get(url);
            console.log(res);
            const status = res.data.status;
            if (status === 200) {
                const data = res.data.data;
            }
        } catch(err) {
            // ignored
        }
    }

    useEffect(() => {
        fetchComment();
    }, [props.contentId, triggerUpdate])

    function handleSubmitComment() {
        const url = "/api/comment/create"
        const query = new FormData();
        query.append("contentId", props.contentId);
        query.append("comment", comment);
        Axios.post(url, query)
            .then((res) => {
                const status = res.data.status;
                if (status === 200) {
                    setTriggerUpdate(!triggerUpdate);
                    toaster.success(res.data.message);
                } else {
                    toaster.danger(res.data.message);
                }
            })
            .catch((err) => {
                toaster.danger(err.response.data.message);
            })
        setShowCommentBox(false);
    }

    return (
        <div className={"comment-section"} >
            <Dialog
                preventBodyScrolling={true}
                isShown={showCommentBox}
                title={"Comment " + `(${comment.length}/500)`}
                onCloseComplete={() => setShowCommentBox(false)}
                onConfirm={() => handleSubmitComment()}
                confirmLabel={"Replay"}
            >
                <div style={{height: "100%"}}>
                    <textarea
                        maxLength={500}
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