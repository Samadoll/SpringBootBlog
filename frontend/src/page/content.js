import React, {useEffect, useState} from 'react';
import Axios from "axios";
import {Table} from "../component/table";

export function Content(props) {
    const [contents, setContents] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const headers = ["Article", "Author", "Create Time"];
    const items = [
        { cid: 1, title: "Test", username: "admin", create_time: "10" }
    ];

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
    }, [])

    return (
        <div>
            <Table
                headers={headers}
                items={items}
            />
        </div>
    )
}