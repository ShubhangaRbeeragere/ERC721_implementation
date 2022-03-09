import React from "react";
import "./navigation.css";
import Select from "react-select";
// const customStyles = {
//     control: (styles) => ({
//         ...styles,
//         outline: "none",
//         border: "0",
//         boxShadow: "none",
//     }),
//     option: (provided, state) => ({
//         ...provided,
//         color: state.isSelected ? "white" : "black",
//         backgroundColor: state.isSelected ? "#03045e" : "white",
//         ":focus": {
//             color: "white",
//         },
//         ":hover": {
//             backgroundColor: "#0096c7",
//             color: "white",
//         },
//     }),
// };

function Navigation({ fromAccount }) {
    return (
        <>
            <div className="navigation">
                <h1>Non Fungible Token</h1>
                <div className="logo"></div>
                <div className="selected__account">
                    <h4>Your Account:</h4> <h5>{fromAccount}</h5>
                </div>
            </div>
        </>
    );
}

export default Navigation;
