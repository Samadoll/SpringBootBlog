import React, {useState} from "react";
import {SearchIcon} from "evergreen-ui";

export function Search(props) {
    const [searchString, setSearchString] = useState("");

    function handleSearch() {
        props.searchFunction.apply(null, [searchString]);
    }

    return (
        <div className={props.className}>
            <input type={"text"} placeholder={"Search..."} onChange={e => setSearchString(e.target.value)} />
            <button onClick={() => handleSearch()}>
                <SearchIcon size={20} color={"muted"}/>
            </button>
        </div>
    );
}