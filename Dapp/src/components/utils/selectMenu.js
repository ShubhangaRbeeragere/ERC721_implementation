import React from "react";
import "./selectMenu.css";
import arrowSvg from "../images/arrow.svg";

function SelectMenu({ options, selected, setter, visible, theme }) {
    return (
        <div className="select__menu">
            <div
                className="selected__wrapper"
                onClick={(e) => {
                    e.preventDefault();
                    console.log("clicked");
                    visible
                        ? setter({
                              options: options,
                              selected: selected,
                              visible: false,
                          })
                        : setter({
                              options: options,
                              selected: selected,
                              visible: true,
                          });
                }}
            >
                <div className="selected">{selected}</div>
                <img src={arrowSvg} alt="arrow" />
            </div>
            <Options
                options={options}
                selected={selected}
                setter={setter}
                visible={visible}
            />
        </div>
    );
}

function Options({ options, selected, setter, visible }) {
    return (
        <div
            className={visible ? "menu__options" : "menu__options menu--hidden"}
        >
            {options.map((value, index) => {
                return (
                    <div
                        className="option"
                        key={index}
                        onClick={() => {
                            setter({
                                options: options,
                                selected: value,
                                visible: false,
                            });
                        }}
                    >
                        <div
                            className={
                                value === selected
                                    ? "circle circle--click"
                                    : "circle"
                            }
                        ></div>
                        <div className="value">{value}</div>
                    </div>
                );
            })}
        </div>
    );
}

export default SelectMenu;
