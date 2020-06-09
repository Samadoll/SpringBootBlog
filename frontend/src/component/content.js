import React, {useEffect, useState} from 'react';
import Axios from "axios";
import {Table} from "./table";
import {ButtonGroup} from "./buttonGroup";
import {Badge} from "evergreen-ui";
import {Pagination} from "./pagination";
import {Search} from "./search";

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
    buildArticleWithTags(items)
}

function buildArticleWithTags(items) {
    items.forEach((item) => {
        item.article = (
            <div className={"table-article-cell"}>
                <div style={{
                    fontSize: "20px",
                    fontFamily: "\"SF UI Display\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"",
                    lineHeight: "25px",
                    fontWeight: 500,
                    margin: "5px 0"
                }}>
                    <label>{item.title}</label>
                </div>
                <div style={{margin: "5px 0"}}>
                    {item.tag.split(",").map((tag, index) => <Badge key={index} color="blue" margin={2}>{tag}</Badge>)}
                </div>
            </div>
        )
    })
}

export function Content(props) {
    const [contents, setContents] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const pagination = <Pagination pagination={{changePage: changePage, page: page, pageCount: pageCount}} className={"table-pagination"}/>
    const search = <Search searchParam={["title", "tag", "author"]} className={"table-search"} searchFunction={handleSearch}/>

    const buttonGroup = <ButtonGroup buttonGroup={props.buttonGroup} groupClass={"table-function-button-group"} buttonClass={"table-function-button"}/>

    async function fetchContents() {
        try {
            const url = props.requestUrl;
            const res = await Axios.get(url);
            const status = res.data.status;
            if (status === 200) {
                const data = res.data.data;
                setPageCount(data.count);
                buildContents(data["articles"], props.headers, props.headerMapping);
                setContents(data["articles"]);
                console.log(data["articles"]);
            }
        } catch (e) {
            // ignored
        }
    }

    useEffect(() => {
        fetchContents();
    }, [props.isMyContent, props.triggerUpdate])

    function changePage(pageNum) {
        if (page === pageNum) return;
        const url = props.requestUrl + `?page=${pageNum}`;
        const query = new URLSearchParams();
        query.append("page", pageNum);
        Axios.get(url)
            .then((res) => {
                const status = res.data.status;
                if (status === 200) {
                    const data = res.data.data;
                    setPage(pageNum);
                    buildContents(data["articles"], props.headers, props.headerMapping);
                    setContents(data["articles"]);
                }
            })
    }

    function handleSearch(searchParam, searchString) {
        alert(searchParam + ":" + searchString);
    }

    return (
        <div className="table-content">
            <Table
                buttonGroup={buttonGroup}
                pagination={pagination}
                searchFunction={search}
                itemIdName={"cid"}
                headers={props.headers}
                headerMapping={props.headerMapping}
                items={contents}
                isSelectable={true}
                rowHeight={60}
                rowOnSelect={props.rowOnSelect}
                rowClass={"content-table-row"}
            />
        </div>
    )
}