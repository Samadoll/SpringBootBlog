import React, {useEffect, useState} from 'react';
import Axios from "axios";
import {Table} from "../component/table";
import {Dialog, TagInput, toaster} from "evergreen-ui";

export function Content(props) {
    const [contents, setContents] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [showDialog, setShowDialog] = useState(false);
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [contentBody, setContentBody] = useState("");
    const headers = ["Article", "Author", "Create Time"];
    const headerMapping = {
        idName: "cid",
        Article: { value: "title", type: "text"},
        Author: { value: "username", type: "text", width: 150},
        "Create Time": { value: "create_time", type: "date", width: 150}
    }
    const pagination = {
        changePage: changePage,
        page: page,
        pageCount: pageCount
    }
    const buttonGroup = [
        {name: "Create Blog", fn: () => setShowDialog(true), enable: props.isLoggedIn},
        {name: "Manage My Blogs", fn: () => alert("Manage My Blog"), enable: props.isLoggedIn}
    ]

    async function fetchContents() {
        try {
            const url = props.isMyContent ? "/api/content/myContents" : "/api/content/contents";
            const res = await Axios.get(url);
            const status = res.status;
            if (status === 200) {
                const data = res.data.data;
                setPageCount(data.count);
                setContents(data["articles"]);
            }
        } catch (e) {
            // ignored
        }
    }

    useEffect(() => {
        fetchContents();
    }, [props.isMyContent])

    function changePage(pageNum) {
        if (page === pageNum) return;
        const url = (props.isMyContent ? "/api/content/myContents" : "/api/content/contents") + `?page=${pageNum}`;
        const query = new URLSearchParams();
        query.append("page", pageNum);
        Axios.get(url)
            .then((res) => {
                const status = res.status;
                if (status === 200) {
                    const data = res.data.data;
                    setPage(pageNum);
                    setContents(data["articles"]);
                    console.log(data["articles"]);
                }
            })
    }

    function addTag(value) {
        const val = (value[0] || "").trim();
        console.log(val);
        console.log(tags);
        if (val === "") {
            toaster.danger("Empty value cannot be added.");
            return;
        }
        if (val.length > 30) {
            toaster.danger("Tag is too long (limit: 30 characters).");
            return;
        }
        if (tags.includes(val)) {
            toaster.danger(`Tag "${val}" has already been added.`);
            return;
        }
        if (tags.length >= 10) {
            toaster.danger("You can only add at most 10 tags.")
            return
        }
        setTags([...tags, val])
    }

    function createBlog() {
        const query = new URLSearchParams();
        query.append("title", title);
        query.append("content", contentBody);
        query.append("tags", tags.join(","));
        Axios.post("/api/content/create", query)
            .then((res) => {
                setShowDialog(false);
            })
            .catch((err) => {
                setShowDialog(false);
            })
    }

    return (
        <div className="table-content">
            <Dialog
                isShown={showDialog}
                preventBodyScrolling={true}
                onCloseComplete={() => {
                    setShowDialog(false);
                    setTitle("");
                    setTags([]);
                    setContentBody("");
                }}
                width={"80%"}
                onConfirm={() => createBlog()}
                confirmLabel={"Create"}
                title={"Create New Blog"}
            >
                <form >
                    <div>
                        <label className="input-field-label">
                            Title:
                            <label className={"count-label"}>
                                ({title.length}/100)
                            </label>
                        </label>
                    </div>
                    <input
                        className="input-field"
                        maxLength="100"
                        required
                        onChange={e => setTitle(e.target.value)}
                    />
                    <br/>
                    <div>
                        <label className="input-field-label">
                            Tags:
                            <label className={"count-label"}>
                                ({tags.length}/10)
                            </label>
                        </label>
                    </div>
                    <TagInput
                        inputProps={{ placeholder: 'Add trees...' }}
                        width={"100%"}
                        values={tags}
                        onAdd={value => addTag(value)}
                        onRemove={(_value, index) => {
                            setTags(tags.filter((_, i) => i !== index));
                        }}
                    />
                    <br/>
                    <div>
                        <label className="input-field-label">
                            Content:
                            <label className={"count-label"}>
                                ({contentBody.length}/1000)
                            </label>
                        </label>
                    </div>
                    <textarea
                        className={"input-field input-field-textarea"}
                        maxLength={1000}
                        onChange={e => setContentBody(e.target.value)}
                    />
                </form>
            </Dialog>
            <Table
                buttonGroup={buttonGroup}
                pagination={pagination}
                itemIdName={"cid"}
                headers={headers}
                headerMapping={headerMapping}
                items={contents}
                isSelectable={true}
                rowHeight={60}
            />
        </div>
    )
}