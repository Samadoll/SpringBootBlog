import React, { useState } from "react";
import { Table as EvergreenTable } from "evergreen-ui"

function TableCell(props) {
    const type = props.type || "text";
    let value = props.value || "";
    let element;
    switch (type) {
        case "date":
            value = new Date(value).toDateString();
            element = <EvergreenTable.TextCell className="TableCellClass">{value}</EvergreenTable.TextCell>
        case "text":
            element = <EvergreenTable.TextCell className="TableCellClass">{value}</EvergreenTable.TextCell>
            break;
    }
    return element
}

export function Table(props) {

    return (
        <EvergreenTable >
            <EvergreenTable.Head className="TableHeaderRow">
                {
                    props.headers.map((el, index) =>
                        <EvergreenTable.TextHeaderCell key={index}>
                            {el}
                        </EvergreenTable.TextHeaderCell>
                    )
                }
            </EvergreenTable.Head>
            <EvergreenTable.Body height={500}>
                {
                    props.items.map((item, index) =>
                        <EvergreenTable.Row
                            key={item[props.itemIdName] || index}
                            isSelectable={props.isSelectable || false}
                        >
                            {props.headers.map((el, index) =>
                                <TableCell
                                    key={index}
                                    type={props.headerMapping[el].type}
                                    value={item[props.headerMapping[el].value]}
                                />
                            )}
                        </EvergreenTable.Row>
                    )
                }
            </EvergreenTable.Body>
        </EvergreenTable>
    )
}