import React from "react";
import "./selectMenu.css";
import arrowSvg from "./arrow.svg";

function SelectMenu({ menuData, setter }) {
    let options = menuData.options;
    let selected = menuData.selected;
    let visible = menuData.visible;
    let theme = menuData.theme;
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
                theme={theme}
            />
        </div>
    );
}

function Options({ options, selected, setter, visible, theme }) {
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
