import React, {useState} from "react";
import {SearchIcon} from "evergreen-ui";

export function Search(props) {
    const [searchParam, setSearchParam] = useState(props.searchParam === undefined ? undefined : props.searchParam[0]);
    const [searchString, setSearchString] = useState("");

    function handleSearch() {
        const params = [];
        if (searchParam !== undefined) params.push(searchParam);
        params.push(searchString);
        props.searchFunction.apply(null, params);
    }

    return (
        <div className={props.className}>
            {
                props.searchParam === undefined
                    ? null
                    : (
                        <select onChange={event => setSearchParam(event.target.value)}>
                            {props.searchParam.map((el, index) => <option key={index} >{el}</option>)}
                        </select>
                    )
            }
            <input type={"text"} placeholder={"Search..."} onChange={e => setSearchString(e.target.value)} />
            <button onClick={() => handleSearch()}>
                <SearchIcon size={20} color={"muted"}/>
            </button>
        </div>
    );
}