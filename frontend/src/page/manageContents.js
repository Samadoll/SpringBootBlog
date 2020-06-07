import React, {useState} from "react";
import {useHistory} from "react-router";
import {Content} from "../component/content";
import {Dialog, toaster} from "evergreen-ui";
import Axios from "axios";

export function ManageContents(props) {
    const history = useHistory()
    const url = "/api/content/myContents";
    const headers = ["Article", "Actions"];
    const [selectedContent, setSelectedContent] = useState(undefined);
    const [showDialog, setShowDialog] = useState(false);
    const [triggerUpdate, setTriggerUpdate] = useState(false);
    const headerMapping = {
        idName: "cid",
        Article: { value: "title", type: "text"},
        Actions: {
            value: "Actions",
            type: "buttons",
            width: 200,
            isCentral: true,
            buttons: [
                { name: "Edit", fn: handleEdit, enable: true, requiredParam: true },
                { name: "Delete", fn: handleDelete, enable: true, requiredParam: true, className: "table-function-button-danger"}
            ]
        }
    }
    const buttonGroup = [
        {name: "Create Blog", fn: () => history.push("/editContent/0"), enable: props.isLoggedIn},
        {name: "Delete Selected", fn: () => alert("TODO"), enable: true, className: "table-function-button-danger"}
    ]

    function handleEdit(el) {
        history.push("/editContent/" + el["cid"]);
    }

    function handleDelete(el) {
        setShowDialog(true);
        setSelectedContent(el);
    }

    function confirmDelete() {
        Axios.delete("/api/content/" + selectedContent["cid"])
            .then((res) => {
                console.log(res);
                const status = res.data.status;
                const msg = res.data.message;
                if (status === 200) {
                    toaster.success(msg);
                } else {
                    toaster.danger(msg);
                }
                setShowDialog(false);
                setTriggerUpdate(!triggerUpdate);
            })
            .catch((err) => {
                setShowDialog(false);
                setTriggerUpdate(!triggerUpdate);
            })
    }

    return (
        <div>
            <Dialog
                isShown={showDialog}
                title="Danger intent"
                intent="danger"
                onCloseComplete={() => setShowDialog(false)}
                onConfirm={() => confirmDelete()}
                confirmLabel="Delete"
                preventBodyScrolling={true}
            >
                <label style={{fontFamily: "\"SF UI Display\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\""}}>
                    Are you sure to delete "{selectedContent !== undefined ? selectedContent.title : ""}"
                </label>
            </Dialog>
            <Content
                isLoggedIn={props.isLoggedIn}
                headers={headers}
                headerMapping={headerMapping}
                buttonGroup={buttonGroup}
                requestUrl={url}
                isMyContent={props.isMyContent}
                triggerUpdate={triggerUpdate}
            />
        </div>
    )
}