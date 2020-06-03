import React, { useState } from "react";
import { Table as EvergreenTable } from "evergreen-ui"

export function Table(props) {

    return (
        <EvergreenTable>
            <EvergreenTable.Head>
                {
                    props.headers.map((el, index) =>
                        <EvergreenTable.TextHeaderCell key={index}>
                            {el}
                        </EvergreenTable.TextHeaderCell>
                    )
                }
            </EvergreenTable.Head>
            <EvergreenTable.Body height={240}>
                {
                    props.items.map(item =>
                        <EvergreenTable.Row
                            key={item.cid}
                            isSelectable
                        >
                            <EvergreenTable.TextCell>{item.title}</EvergreenTable.TextCell>
                            <EvergreenTable.TextCell>{item.username}</EvergreenTable.TextCell>
                            <EvergreenTable.TextCell>{item.create_time}</EvergreenTable.TextCell>
                        </EvergreenTable.Row>
                    )
                }
            </EvergreenTable.Body>
        </EvergreenTable>
    )
}