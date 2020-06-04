import React, {useEffect, useState} from 'react';
import Axios from "axios";
import {Table} from "../component/table";

export function Content(props) {
    const [contents, setContents] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const headers = ["Article", "Author", "Create Time"];
    const headerMapping = {
        idName: "cid",
        Article: { value: "title", type: "text"},
        Author: { value: "username", type: "text", width: 100},
        "Create Time": { value: "create_time", type: "date", width: 150}
    }

    async function fetchContents() {
        try {
            const url = props.isMyContent ? "/api/content/myContents" : "/api/content/contents";
            const res = await Axios.get(url);
            const status = res.status;
            if (status === 200) {
                const data = res.data.data;
                setPageCount(data.count);
                setContents(data["articles"]);
                console.log(data["articles"]);
            }
        } catch (e) {
            // ignored
        }
    }

    useEffect(() => {
        fetchContents();
    }, [props.isMyContent])

    return (
        <div className="TableContent">
            <Table
                itemIdName={"cid"}
                headers={headers}
                headerMapping={headerMapping}
                items={contents}
                isSelectable={true}
            />
        </div>
    )
}