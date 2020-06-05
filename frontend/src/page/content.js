import React, {useEffect, useState} from 'react';
import Axios from "axios";
import {Table} from "../component/table";
import {Redirect} from "react-router";

export function Content(props) {
    const [contents, setContents] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
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
        {name: "Create Blog", fn: () => alert("Create Blog"), enable: props.isLoggedIn},
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
                console.log(data["articles"]);
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

    return (
        <div className="table-content">
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