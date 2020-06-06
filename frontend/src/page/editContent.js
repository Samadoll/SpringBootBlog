import React, {useEffect, useState} from "react";
import {TagInput, toaster} from "evergreen-ui";
import {useHistory, useParams} from "react-router";
import Axios from "axios";

export function EditContent(props) {
    const history = useHistory()
    const {id} = useParams();
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [contentBody, setContentBody] = useState("");
    const [isToCreate, setIsToCreate] = useState(true);

    async function fetchBlog(id) {
        if (Number(id) === 0) return;
        try {
            const url = "/api/content/getEditableContent/" + id;
            const res = await Axios.get(url);
            const status = res.data.status;
            if (status === 200) {
                const data = res.data.data;
                const article = data.article
                setTitle(article.title);
                setContentBody(article.content);
                setTags(data.tags.map((tag) => tag.name));
                setIsToCreate(false)
            } else {
                toaster.danger(res.data.message);
                history.goBack();
            }
        } catch (e) {
            // ignored
        }
    }

    useEffect(() => {
        fetchBlog(id);
    }, [])

    function addTag(value) {
        const val = (value[0] || "").trim();
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

    function handleEditContent() {
        if (!validate()) {
            toaster.danger("All fields should be filled.")
            return;
        }
        const query = new FormData();
        query.append("title", title);
        query.append("content", contentBody);
        query.append("tags", tags.join(","));
        let method = isToCreate ? "post" : "put";
        let url = isToCreate ? "/api/content/create" : ("/api/content/" + id);
        Axios({
            method: method,
            url: url,
            data: query
        }).then((res) => {
            const status = res.data.status;
            if (status === 200) {
                toaster.success(res.data.message);
                history.goBack();
            } else {
                toaster.danger(res.data.message);
            }
        }).catch((err) => {
            // ignore
        })
    }

    function validate() {
        return title.trim() !== "" && tags.length > 0 && contentBody.trim() !== "";
    }

    return (
        <div className={"edit-content"}>
            <div style={{textAlign: "center", fontFamily: "Verdana", fontSize: "30px"}}>
                <label>{isToCreate ? "Create New Blog" : "Update Your Blog"}</label>
            </div>
            <hr style={{borderTop: "1px solid #EDF0F2", margin: "15px 10px"}} />
            <div style={{width: "90%", margin: "auto"}}>
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
                        value={title}
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
                    {/* TODO: FIX TagInput Style */}
                    <TagInput
                        inputProps={{ placeholder: 'Add tags...' }}
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
                        value={contentBody}
                    />
                </form>
                <button
                    className={"login-register-button-primary" + (validate() ? "" : " button-disabled")}
                    onClick={() => handleEditContent()}
                    disabled={!validate()}
                >
                    { isToCreate ? "Create" : "Update" }
                </button>
            </div>
        </div>
    )
}