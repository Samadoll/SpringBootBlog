import React from "react";
import { Table as EvergreenTable } from "evergreen-ui"

function TableCell(props) {
    const properties = {
        className: (props.isHeaderCell ? "table-header-cell" : "table-cell") + (props.isCentral ? " table-cell-center" : "")
    };
    let type = props.type || "text";
    let value = props.value || "";
    if (props.width !== undefined) {
        properties.flexBasis = props.width;
        properties.flexShrink = 0;
        properties.flexGrow = 0;
    }
    if (props.isHeaderCell) type = "text";

    let element;
    switch (type) {
        case "date":
            if (!props.isHeaderCell) value = new Date(value).toDateString();
            element = <Cell type={"text"} isHeaderCell={props.isHeaderCell || false} properties={properties} value={value} />
            break;
        case "text":
            element = <Cell type={"text"} isHeaderCell={props.isHeaderCell || false} properties={properties} value={value} />
            break;
        case "buttons":
        case "custom":
            element = <Cell type={type} properties={properties} value={value} />
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

export function Table(props) {
    return (
        <EvergreenTable >
            {
                props.pagination !== undefined || props.searchFunction !== undefined || props.buttonGroup !== undefined
                    ? (
                        <EvergreenTable.Row >
                            <div className="table-function-row">
                                {props.buttonGroup ?? null}
                                {props.searchFunction ?? null}
                                {props.pagination ?? null}
                            </div>
                        </EvergreenTable.Row>
                    )
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
                            isCentral={props.headerMapping[el].isCentral}
                        />
                    )
                }
            </EvergreenTable.Head>
            <EvergreenTable.Body>
                {
                    props.items.length === 0
                        ? (
                            <EvergreenTable.Row >
                                <div className={"no-record"}>
                                    <label>No Records or No Access Right</label>
                                </div>
                            </EvergreenTable.Row>)
                        : (
                            props.items.map((item, index) =>
                                <EvergreenTable.Row
                                    key={item[props.itemIdName] || index}
                                    isSelectable={props.isSelectable || false}
                                    height={props.rowHeight || 48}
                                    onSelect={props.rowOnSelect ? () => props.rowOnSelect(item) : () => {}}
                                    className={props.rowClass || ""}
                                >
                                    {props.headers.map((el, index) =>
                                        <TableCell
                                            key={index}
                                            type={props.headerMapping[el].type}
                                            value={item[props.headerMapping[el].value]}
                                            width={props.headerMapping[el].width}
                                            isCentral={props.headerMapping[el].isCentral}
                                        />
                                    )}
                                </EvergreenTable.Row>
                            )
                        )
                }
            </EvergreenTable.Body>
        </EvergreenTable>
    )
}