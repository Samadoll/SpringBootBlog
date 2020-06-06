import React, {useEffect, useState} from 'react';
import Axios from "axios";
import {Table} from "./table";
import {ButtonGroup} from "./buttonGroup";

function buildContents(items, headers, headerMapping) {
    for (let header of headers) {
        let type = headerMapping[header].type;
        if (type === "buttons") {
            items.forEach((item) => {
                item[header] = (
                    <ButtonGroup
                        buttonGroup={headerMapping[header].buttons}
                        groupClass={"table-cell-function-button-group"}
                        buttonClass={"table-function-button"}
                        targetParam={[item]}
                    />
                )
            })
        }
    }
}

export function Content(props) {
    const [contents, setContents] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const pagination = {
        changePage: changePage,
        page: page,
        pageCount: pageCount
    }

    async function fetchContents() {
        try {
            const url = props.requestUrl;
            const res = await Axios.get(url);
            const status = res.status;
            if (status === 200) {
                const data = res.data.data;
                setPageCount(data.count);
                buildContents(data["articles"], props.headers, props.headerMapping);
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
        const url = props.requestUrl + `?page=${pageNum}`;
        const query = new URLSearchParams();
        query.append("page", pageNum);
        Axios.get(url)
            .then((res) => {
                const status = res.status;
                if (status === 200) {
                    const data = res.data.data;
                    setPage(pageNum);
                    setContents(data["articles"]);
                }
            })
    }

    return (
        <div className="table-content">
            <Table
                buttonGroup={props.buttonGroup}
                pagination={pagination}
                itemIdName={"cid"}
                headers={props.headers}
                headerMapping={props.headerMapping}
                items={contents}
                isSelectable={true}
                rowHeight={60}
            />
        </div>
    )
}