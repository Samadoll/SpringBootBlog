import React, {useEffect, useState} from 'react';
import Axios from "axios";
import {Table} from "./table";
import {ButtonGroup} from "./buttonGroup";
import {Badge, toaster} from "evergreen-ui";
import {Pagination} from "./pagination";
import {Search} from "./search";
import {useHistory} from "react-router";

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
    const history = useHistory();
    const [contents, setContents] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [searchString, setSearchString] = useState("");

    const pagination = <Pagination pagination={{changePage: changePage, page: page, pageCount: pageCount}} className={"table-pagination"}/>
    const search = <Search className={"table-search"} searchFunction={handleSearch}/>
    const buttonGroup = <ButtonGroup buttonGroup={props.buttonGroup} groupClass={"table-function-button-group"} buttonClass={"table-function-button"}/>

    async function fetchContents() {
        try {
            const url = props.requestUrl + (searchString === "" ? "" : `?searchString=${searchString}`);
            const res = await Axios.get(url);
            const status = res.data.status;
            if (status === 200) {
                const data = res.data.data;
                handleResponse(data, data.page);
            }
        } catch (err) {
            toaster.danger(err.response.data.message);
            history.goBack();
        }
    }

    useEffect(() => {
        fetchContents();
    }, [props.isMyContent, props.triggerUpdate])

    function changePage(pageNum) {
        if (page === pageNum) return;
        const url = props.requestUrl + `?page=${pageNum}` + (searchString === "" ? "" : `&searchString=${searchString}`);
        Axios.get(url)
            .then((res) => {
                const status = res.data.status;
                if (status === 200) {
                    const data = res.data.data;
                    handleResponse(data, pageNum);
                }
            })
    }

    function handleSearch(searchString) {
        setSearchString(searchString);
        const url = props.requestUrl + (searchString === "" ? "" : `?searchString=${searchString}`);
        Axios.get(url)
            .then((res) => {
                const status = res.data.status;
                if (status === 200) {
                    const data = res.data.data;
                    handleResponse(data, 1);
                }
            })
    }

    function handleResponse(data, page) {
        setPage(page);
        setPageCount(data.count);
        buildContents(data["articles"], props.headers, props.headerMapping);
        setContents(data["articles"]);
    }

    return (
        <div className="table-content">
            <div className={"content-header"}>
                <label>{`${props.isMyContent ? "My" : "All"} Contents`}</label>
            </div>
            <hr style={{margin: 0, border: "1px solid #EDF0F2"}}/>
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