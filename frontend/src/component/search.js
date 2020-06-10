import React, {useState} from "react";
import {SearchIcon, ResetIcon} from "evergreen-ui";

export function Search(props) {
    const [searchString, setSearchString] = useState("");

    function handleSearch(search) {
        setSearchString(search);
        props.searchFunction.apply(null, [search]);
    }

    return (
        <div className={props.className}>
            <button onClick={() => handleSearch("")} className={`${props.className}-button-front`}>
                <ResetIcon size={20} color={"muted"}/>
            </button>
            <input type={"text"} placeholder={"Search..."} onChange={e => setSearchString(e.target.value)} value={searchString}/>
            <button onClick={() => handleSearch(searchString)} className={`${props.className}-button-back`}>
                <SearchIcon size={20} color={"muted"}/>
            </button>
        </div>
    );
}