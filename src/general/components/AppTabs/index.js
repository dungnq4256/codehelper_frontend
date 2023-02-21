import React, { useState, useEffect } from "react";
import { Tabs } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import "./style.scss";

/**
 * @props className (string): không bắt buộc
 * @props tabs (array string): Mảng tên các tab theo thứ tự đảo ngược
 * @props activeTab (string): Tên active tab. K bắt buộc, mặc định là tab đầu
 * @props handleClick(tabName) : Hàm callback tới node cha khi click vào tab
 */
function AppTabs(props) {
    const id = uuidv4();

    const tabs = props.tabs;
    const activeTab = props.activeTab ? props.activeTab : tabs[tabs.length - 1];

    const onClick = (tab) => {
        props.handleClick(tab);
    };

    // useEffect(() => {
    //     var allTabs = document.getElementById(id).getElementsByClassName("tab");
    //     for (var i = 0, len = allTabs.length; i < len; i++) {
    //         allTabs[i].addEventListener("click", function () {
    //             if (this.classList.contains("active")) return;

    //             var parent = this.parentNode,
    //                 innerTabs = parent.querySelectorAll(".tab");

    //             for (
    //                 var index = 0, iLen = innerTabs.length;
    //                 index < iLen;
    //                 index++
    //             ) {
    //                 innerTabs[index].classList.remove("active");
    //             }

    //             this.classList.add("active");
    //         });
    //     }
    // }, []);

    return (
        <div className='AppTabs rounded bg-gray-200 d-flex flex-stack flex-wrap mb-9 p-2'>
            <ul className='nav flex-wrap border-transparent'>
                {tabs.map((item, index) => {
                    return (
                        <li key={index} className='nav-item my-1'>
                            <div
                                className={`btn btn-sm btn-color-gray-600 bg-state-body btn-active-color-gray-800 fw-bolder fw-bold fs-6 fs-lg-base nav-link px-3 px-lg-4 mx-1 ${
                                    item == activeTab ? "tab active" : "tab"
                                }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onClick(item);
                                }}>
                                {item}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default AppTabs;
