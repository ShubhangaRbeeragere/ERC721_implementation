import React from "react";

function SelectMenu({ selected, options }) {
    return (
        <div className="selectMenu">
            <div>{selected}</div>
            <Options options={options} />
        </div>
    );
}

function Options({ options }) {
    return (
        <div className="menu__options">
            {options.map((value, index) => {
                return (
                    <div className="option" key={index}>
                        {value}
                    </div>
                );
            })}
        </div>
    );
}

export default SelectMenu;
