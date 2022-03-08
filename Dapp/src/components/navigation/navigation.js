import React from "react";
import "./navigation.css";
import Select from "react-select";
const customStyles = {
    control: (styles) => ({
        ...styles,
        outline: "none",
        border: "0",
        boxShadow: "none",
    }),
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? "white" : "black",
        backgroundColor: state.isSelected ? "#03045e" : "white",
        ":focus": {
            color: "white",
        },
        ":hover": {
            backgroundColor: "#0096c7",
            color: "white",
        },
    }),
};

function Navigation({ fromOptions, setFromOptions }) {
    let options = fromOptions.options;

    return (
        <>
            <div className="navigation">
                <h1>Non Fungible Token</h1>
                <div className="logo"></div>
            </div>
            <div className="select_menu">
                {options.length > 0 && (
                    <Select
                        options={options}
                        styles={customStyles}
                        defaultValue={options[0]}
                        onChange={(selected) => {
                            console.log(selected.value);
                            setFromOptions({
                                ...fromOptions,
                                selected: selected,
                            });
                        }}
                    />
                )}
            </div>
        </>
    );
}

export default Navigation;
