import React, {useEffect, useState} from "react";
import { Table as EvergreenTable, ChevronLeftIcon, ChevronRightIcon, Select } from "evergreen-ui"

function TableCell(props) {
    const properties = {
        className: props.isHeaderCell ? "table-header-cell" : "table-cell"
    };
    const type = props.type || "text";
    let value = props.value || "";
    if (props.width !== undefined) {
        properties.flexBasis = props.width;
        properties.flexShrink = 0;
        properties.flexGrow = 0;
    }
    let element;
    switch (type) {
        case "date":
            if (!props.isHeaderCell) value = new Date(value).toDateString();
        case "text":
            element = <Cell type={"text"} isHeaderCell={props.isHeaderCell || false} properties={properties} value={value} />
            break;
    }
    return element
}

function Cell(props) {
    switch (props.type) {
        case "text":
            return props.isHeaderCell
                ? <EvergreenTable.TextCell {...props.properties} >{props.value}</EvergreenTable.TextCell>
                : <EvergreenTable.TextHeaderCell {...props.properties} >{props.value}</EvergreenTable.TextHeaderCell>;
        default:
            return <EvergreenTable.Cell {...props.properties} >{props.value}</EvergreenTable.Cell>;
    }
}

function FunctionRow(props) {
    return (
        <div className="table-function-row">
            {props.searchFunction !== undefined ? <div>Search</div> : null}
            {
                props.pagination === undefined
                    ? null
                    : <Pagination {...props} />
            }
        </div>
    )
}

function Pagination(props) {
    let page = props.pagination.page;
    let count = props.pagination.pageCount;
    const [leftArrowColor, setLeftArrowColor] = useState(Number(page) === 1 ? "disabled" : "mute");
    let [rightArrowColor, setRightArrowColor] = useState(Number(page) === Number(count) ? "disabled" : "mute");
    const pages = [];
    for (let i = 1; i <= count; i++) pages.push(i);

    useEffect(() => {
        setLeftArrowColor(Number(page) === 1 ? "pagination-disabled" : "");
        setRightArrowColor(Number(page) === Number(count) ? "pagination-disabled" : "");
        console.log(Number(page) === 1);
        console.log(Number(page) === Number(count))
        console.log(`hit. Page: ${page}, Count: ${count}, L: ${leftArrowColor}, R:${rightArrowColor}`);
    }, [page, leftArrowColor, rightArrowColor])

    return (
        <div className="table-pagination">
            <button
                className={"pagination-arrow"}
                disabled={Number(page) === 1}
                onClick={() => props.pagination.changePage(page - 1)}
            >
                <ChevronLeftIcon color={"mute"} size={20} className={Number(page) === 1 ? "pagination-disabled" : ""} />
            </button>
            <label className="pagination-text">{page}</label>
            <button
                className={"pagination-arrow"}
                disabled={Number(page) === Number(count)}
                onClick={() => props.pagination.changePage(page + 1)}
            >
                <ChevronRightIcon color={"mute"} size={20} className={Number(page) === Number(count) ? "pagination-disabled" : ""} />
            </button>
            <select
                className={"pagination-select"}
                onChange={event => props.pagination.changePage(event.target.value)}
                value={page}
            >
                {pages.map((num, index) => <option key={index}>{num}</option>)}
            </select>
        </div>
    );
}

export function Table(props) {
    return (
        <EvergreenTable >
            {
                props.pagination !== undefined || props.searchFunction !== undefined
                    ? <EvergreenTable.Row children={<FunctionRow pagination={props.pagination} searchFunction={props.searchFunction} />} />
                    : null
            }
            <EvergreenTable.Head
                className="table-header-row"
                height={props.headerRowHeight || 48}
            >
                {
                    props.headers.map((el, index) =>
                        <TableCell
                            key={index}
                            type={props.headerMapping[el].type}
                            value={el}
                            width={props.headerMapping[el].width}
                            isHeaderCell={true}
                        />
                    )
                }
            </EvergreenTable.Head>
            <EvergreenTable.Body>
                {
                    props.items.map((item, index) =>
                        <EvergreenTable.Row
                            key={item[props.itemIdName] || index}
                            isSelectable={props.isSelectable || false}
                            height={props.rowHeight || 48}
                        >
                            {props.headers.map((el, index) =>
                                <TableCell
                                    key={index}
                                    type={props.headerMapping[el].type}
                                    value={item[props.headerMapping[el].value]}
                                    width={props.headerMapping[el].width}
                                />
                            )}
                        </EvergreenTable.Row>
                    )
                }
            </EvergreenTable.Body>
        </EvergreenTable>
    )
}