import React from "react";

export function ButtonGroup(props) {
    return (
        <div className={props.groupClass || ""}>
            {
                props.buttonGroup.map((el, index) =>
                    <button
                        className={(el.className || props.buttonClass) + (el.enable ? " " : " button-disabled ")}
                        key={index}
                        tabIndex={-1}
                        disabled={el.enable ? "" : "disabled"}
                        onClick={() => props.targetParam !== undefined ? el.fn.apply(null, props.targetParam) : el.fn()}
                    >
                        {el.name}
                    </button>
                )
            }
        </div>
    )
}