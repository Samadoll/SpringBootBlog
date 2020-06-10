import React, {useState} from "react";
import {Dialog} from "evergreen-ui";

export function CommentSection(props) {
    const [showCommentBox, setShowCommentBox] = useState(false);
    return (
        <div className={"comment-section"} >
            <Dialog
                preventBodyScrolling={true}
                isShown={showCommentBox}
                title={"Comment"}
                onCloseComplete={() => setShowCommentBox(false)}
                confirmLabel={"Replay"}
            >
                <div style={{height: "100%"}}>
                    <textarea
                        placeholder={"Leave a comment..."}
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