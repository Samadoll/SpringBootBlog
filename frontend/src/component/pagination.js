import React from "react";
import {ChevronLeftIcon, ChevronRightIcon} from "evergreen-ui";

export function Pagination(props) {
    let page = props.pagination.page;
    let count = props.pagination.pageCount;
    const pages = [];
    for (let i = 1; i <= count; i++) pages.push(i);

    return (
        <div className={props.className}>
            <button
                className={"pagination-arrow"}
                disabled={Number(page) === 1}
                onClick={() => props.pagination.changePage(Number(page) - 1)}
                tabIndex={-1}
            >
                <ChevronLeftIcon
                    color={"mute"}
                    size={20}
                    className={Number(page) === 1 ? "pagination-disabled" : ""}
                    tabIndex={-1}
                />
            </button>
            <label className="pagination-text" tabIndex={-1}>{page}</label>
            <button
                className={"pagination-arrow"}
                disabled={Number(page) === Number(count)}
                onClick={() => props.pagination.changePage(Number(page) + 1)}
                tabIndex={-1}
            >
                <ChevronRightIcon
                    color={"mute"}
                    size={20}
                    className={Number(page) === Number(count) ? "pagination-disabled" : ""}
                    tabIndex={-1}
                />
            </button>
            <select
                className={"pagination-select"}
                onChange={event => props.pagination.changePage(event.target.value)}
                value={page}
                tabIndex={-1}
            >
                {pages.map((num, index) => <option key={index}>{num}</option>)}
            </select>
        </div>
    );
}
