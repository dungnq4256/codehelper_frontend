import PropTypes from "prop-types";
import React, { useState } from "react";
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import Utils from "general/utils/Utils";
import Global from "general/utils/Global";
import "./style.scss";
import AppData from "general/constants/AppData";

Pagination.propTypes = {
    rowsPerPage: PropTypes.number.isRequired,
    rowCount: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeRowsPerPage: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    currentRows: PropTypes.number,
};

Pagination.defaultProps = {
    rowsPerPage: Global.gDefaultPagination,
    rowCount: 0,
    onChangePage: null,
    onChangeRowsPerPage: null,
    currentPage: 1,
    currentRows: 0,
};

function Pagination(props) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    let {
        rowsPerPage,
        rowCount,
        onChangePage,
        onChangeRowsPerPage,
        currentPage,
        currentRows,
    } = props;
    rowsPerPage = parseInt(rowsPerPage);
    currentPage = parseInt(currentPage);
    const totalPages = Math.ceil(rowCount / rowsPerPage);
    const iDisplayFrom = (currentPage - 1) * rowsPerPage + 1;
    let iDisplayTo = (currentPage - 1) * rowsPerPage + rowsPerPage;
    if (iDisplayTo > rowCount) {
        iDisplayTo = rowCount;
    }

    const arrButtons = [];
    let firstIndex =
        currentPage - 3 > 0
            ? currentPage - 3 > totalPages - 5
                ? totalPages - 5
                : currentPage - 3
            : 0;
    if (firstIndex < 0) firstIndex = 0;
    let lastIndex =
        currentPage + 1 > totalPages - 1
            ? totalPages - 1
            : currentPage + 1 < 4
            ? 4
            : currentPage + 1;
    if (lastIndex > totalPages - 1) {
        lastIndex = totalPages - 1;
    }
    for (firstIndex; firstIndex <= lastIndex; firstIndex++) {
        arrButtons.push(
            <button
                key={firstIndex}
                page={firstIndex + 1}
                onClick={handlePageChange}
                className={`btn btn-icon btn-sm border-0 btn-secondary mr-2 my-1 ${
                    firstIndex === currentPage - 1
                        ? "active btn-hover-primary"
                        : ""
                }`}>
                {Utils.formatNumber(firstIndex + 1)}
            </button>
        );
    }

    function handlePageChange(e) {
        const newPage = e.target.getAttribute("page");
        const iNewPage = parseInt(newPage);
        if (onChangePage && iNewPage !== currentPage) {
            onChangePage(iNewPage);
        }
    }

    const handlePerPageChange = (e) => {
        const value = e.target.innerText;
        const intValue = parseInt(value);
        if (onChangeRowsPerPage && intValue) {
            onChangeRowsPerPage(intValue);
        }
    };

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className='Pagination w-100'>
            <div className='d-flex justify-content-between align-items-center flex-wrap'>
                <div className='d-flex flex-wrap py-2 mr-3'>
                    <button
                        onClick={() => {
                            if (onChangePage) {
                                onChangePage(1);
                            }
                        }}
                        className='btn btn-icon btn-sm btn-secondary border btn-hover-primary mr-2 my-1'
                        disabled={currentPage <= 1}>
                        <i className='fad fa-angle-double-left icon-1x'></i>
                    </button>
                    <button
                        onClick={() => {
                            if (onChangePage) {
                                onChangePage(currentPage - 1);
                            }
                        }}
                        className='btn btn-icon btn-sm btn-secondary border btn-hover-primary mr-2 my-1'
                        disabled={currentPage <= 1}>
                        <i className='fad fa-angle-left icon-1x'></i>
                    </button>

                    {arrButtons}

                    <button
                        onClick={() => {
                            if (onChangePage) {
                                onChangePage(currentPage + 1);
                            }
                        }}
                        className='btn btn-icon btn-sm btn-secondary border btn-hover-primary mr-2 my-1'
                        disabled={currentPage >= totalPages}>
                        <i className='fad fa-angle-right icon-1x'></i>
                    </button>
                    <button
                        onClick={() => {
                            if (onChangePage) {
                                onChangePage(totalPages);
                            }
                        }}
                        className='btn btn-icon btn-sm btn-secondary border btn-hover-primary mr-2 my-1'
                        disabled={currentPage >= totalPages}>
                        <i className='fad fa-angle-double-right icon-1x'></i>
                    </button>
                </div>

                <div className='d-flex align-items-center'>
                    <p className='m-0 mr-2'>Số lượng tối đa trên một trang</p>
                    <Dropdown
                        isOpen={dropdownOpen}
                        toggle={handleDropdownToggle}
                        style={{ width: "60px" }}
                        size='sm'>
                        <DropdownToggle
                            caret
                            className='d-flex align-items-center justify-content-between btn-hover-primary border'>
                            {rowsPerPage}
                            <i
                                className=' ml-2 fas fa-caret-down'
                                style={{ color: "#4A5677" }}></i>
                        </DropdownToggle>
                        <DropdownMenu>
                            {AppData.perPageItems.map((item, index) => {
                                return (
                                    <DropdownItem
                                        key={index}
                                        active={item.value == rowsPerPage}
                                        onClick={handlePerPageChange}>
                                        {item.value}
                                    </DropdownItem>
                                );
                            })}
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
        </div>
    );
}

export default Pagination;
