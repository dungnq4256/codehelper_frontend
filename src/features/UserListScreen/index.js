import React from "react";
import PropTypes from "prop-types";
import "./style.scss";
import BaseLayout from "general/components/BaseLayout";
import SummaryUser from "general/components/SummaryUser";
import { setPaginationUserPerPage, thunkGetUsersList } from "./UsersListSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import BaseSearchBar from "general/components/Form/BaseSearchBar";
import Loading from "general/components/Loading";
import Empty from "general/components/Empty";
import AppResource from "general/constants/AppResource";
import Pagination from "general/components/Pagination";
import Global from "general/utils/Global";
import { useNavigate } from "react-router-dom";

UserListScreen.propTypes = {};
function UserListScreen(props) {
    const [filters, setFilters] = useState({
        q: "",
        page: 1,
        limit: Global.gDefaultPagination,
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isGettingUsersList, usersList, paginationListUser } = useSelector((state) => state?.user);
    useEffect(() => {
        dispatch(thunkGetUsersList(filters));
    }, [filters]);
    return (
        <BaseLayout selected='users'>
            <div className='mx-3'>
                <BaseSearchBar
                    value={filters.q}
                    name='userFilter'
                    placeholder='Tìm kiếm người dùng'
                    onSubmit={(value) => {
                        setFilters({ ...filters, q: value });
                    }}
                />
            </div>
            <div className='row mt-8 mx-0'>
                {isGettingUsersList ? (
                    <div className='d-flex align-items-center justify-content-center'>
                        <Loading showBackground={false} message='Đang lấy dữ liệu' />
                    </div>
                ) : usersList?.length > 0 ? (
                    usersList?.map((item, index) => {
                        if (item?.accountLevel !== "ADMIN") {
                            return (
                                <div
                                    onClick={() => {
                                        navigate(`/account/${item?._id}`);
                                    }}
                                    key={index}
                                    className='UserListScreen_Cell col-12 col-md-6 col-lg-4 col-xl-3 mb-7 cursor-pointer'>
                                    <SummaryUser
                                        avatar={item?.avatar?.path}
                                        userName={item.fullname}
                                        job={item.job}
                                        email={item.email}
                                        address={item.address}
                                        phone={item.phone}
                                    />
                                </div>
                            );
                        }
                    })
                ) : (
                    <div>
                        <Empty
                            text='Không có kết quả phù hợp'
                            buttonText='Làm mới'
                            visible={false}
                            imageEmpty={AppResource.images.errorStates.noSearchFound}
                        />
                    </div>
                )}
                <div>
                    <div className='d-flex align-items-center justify-content-center mt-0'>
                        <Pagination
                            rowsPerPage={paginationListUser.perPage}
                            rowCount={paginationListUser.count ?? usersList?.length}
                            currentPage={paginationListUser.currentPage ?? 1}
                            onChangePage={(newPage) => {
                                let iNewPage = parseInt(newPage);
                                Global.g_needToRefreshUsers = true;
                                setFilters({
                                    ...filters,
                                    page: iNewPage,
                                });
                            }}
                            onChangeRowsPerPage={(newPerPage) => {
                                const iNewPerPage = parseInt(newPerPage);
                                dispatch(setPaginationUserPerPage(iNewPerPage));
                                Global.g_needToRefreshUsers = true;
                                setFilters({
                                    ...filters,
                                    page: 1,
                                    limit: iNewPerPage,
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
}

export default UserListScreen;
