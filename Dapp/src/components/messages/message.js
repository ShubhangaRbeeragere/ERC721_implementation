import React from "react";
import "./message.css";
import Close from "./Close.png";

function Message({ message, setMessage }) {
    return message.visible ? (
        <div className="message">
            <div className="text">
                <h4>Message:</h4>
                <p>{message.data}</p>
            </div>
            <span
                onClick={() => {
                    setMessage({ ...message, visible: false });
                }}
            >
                <img src={Close} alt="close" />
            </span>
        </div>
    ) : (
        ""
    );
}

export default Message;
