import React, { useState } from "react";
import { Table as EvergreenTable } from "evergreen-ui"

function TableCell(props) {
    const properties = {
        className: "TableCellClass"
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
            value = new Date(value).toDateString();
        case "text":
            element = <TextCell isHeaderCell={props.isHeaderCell || false} properties={properties} value={value} />
            break;
    }
    return element
}

function TextCell(props) {
    return props.isHeaderCell
        ? <EvergreenTable.TextCell {...props.properties} >{props.value}</EvergreenTable.TextCell>
        : <EvergreenTable.TextHeaderCell {...props.properties} >{props.value}</EvergreenTable.TextHeaderCell>
}

export function Table(props) {

    return (
        <EvergreenTable >
            <EvergreenTable.Head
                className="TableHeaderRow"
                height={props.headerRowHeight || 48}
            >
                {
                    props.headers.map((el, index) =>
                        <TableCell
                            key={index}
                            type={props.headerMapping[el].type}
                            value={el}
                            width={props.headerMapping[el].width}
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