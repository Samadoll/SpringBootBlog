import React, {useEffect, useState} from "react";
import {Avatar, Dialog, toaster} from "evergreen-ui";
import Axios from "axios";
import {Pagination} from "./pagination";

function CommentBlock(props) {
    const item = props.item;
    let paragraphs = item.comment.replace(/(\r)/g, "").split("\n");
    return (
        <div style={{height: "auto"}}>
            <hr style={{borderTop: "1px solid #EDF0F2"}} />
            <div className={"comment-block"}>
                <div className={"comment-info"}>
                    <Avatar
                        name={item.username}
                        size={50}
                        marginTop="5px"
                    />
                    <br/>
                    <label>{item.username}</label>
                </div>
                <div className={"comment-block-comment"} >
                    <label>{new Date(item["create_time"]).toLocaleString()}</label>
                    <hr style={{borderTop: "1px solid #EDF0F2"}} />
                    {paragraphs.map((el, index) => el === "" ? <br key={index} /> :<p key={index}>{el}</p>)}
                </div>
            </div>
        </div>
    )
}

export function CommentSection(props) {
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [triggerUpdate, setTriggerUpdate] = useState(true);
    const [checkTrigger, setCheckTrigger] = useState(true);
    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);

    async function fetchComments() {
        try {
            let url = "/api/comment/getComments?contentId=" + props.contentId;
            if (checkTrigger !== triggerUpdate) {
                setCheckTrigger(triggerUpdate);
                url += "&page=" + (pageCount + 1);
            }
            const res = await Axios.get(url);
            const status = res.data.status;
            if (status === 200) {
                const data = res.data.data;
                setComments(data.comments);
                setPageCount(data.count);
                setPage(Math.min(data.page, data.count));
            }
        } catch(err) {
            // ignored
        }
    }

    useEffect(() => {
        fetchComments();
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
                    setCheckTrigger(triggerUpdate);
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
        setComment("");
    }

    function changePage(pageNum) {
        const url = `/api/comment/getComments?contentId=${props.contentId}&page=${pageNum}`;
        Axios.get(url)
            .then((res) => {
                const status = res.data.status;
                if (status === 200) {
                    const data = res.data.data;
                    setComments(data.comments);
                    setPageCount(data.count);
                    setPage(data.page);
                }
            })
    }

    return (
        <div className={"comment-section"} >
            <Dialog
                preventBodyScrolling={true}
                isShown={showCommentBox}
                title={"Comment " + `(${comment.length}/500)`}
                onCloseComplete={() => {
                    setShowCommentBox(false);
                    setComment("");
                }}
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
                <Pagination pagination={{changePage: changePage, page: page, pageCount: pageCount}} className={"table-pagination"}/>
            </div>
            <div className={"comment-section-comments"}>
                {
                    comments.length === 0
                        ? (
                            <div>
                                <hr style={{borderTop: "1px solid #EDF0F2"}} />
                                <div style={{
                                    fontSize: 15,
                                    fontFamily: "Verdana",
                                    padding: "10px 10px 18px 10px",
                                    height: 20
                                }}>
                                    <label>No Comments</label>
                                </div>
                            </div>
                        )
                        : comments.map((item, index) => <CommentBlock key={index} item={item} />)
                }
            </div>
        </div>
    )
}