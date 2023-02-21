import React from "react";
import PropTypes from "prop-types";
import BaseLayout from "general/components/BaseLayout";
import BaseSearchBar from "general/components/Form/BaseSearchBar";
import { useState } from "react";
import Global from "general/utils/Global";
import DropdownSelect from "general/components/Form/DropdownSelect";
import AppData from "general/constants/AppData";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setPaginationTagPerPage,
    thunkGetTagList,
} from "features/TagScreen/tagSlice";
import Loading from "general/components/Loading";
import Empty from "general/components/Empty";
import AppResource from "general/constants/AppResource";
import CellTag from "features/TagScreen/components/CellTag";
import Pagination from "general/components/Pagination";
import { useNavigate } from "react-router-dom";

ListTagScreen.propTypes = {};

function ListTagScreen(props) {
    // MARK: --- Params ---
    const [filters, setFilters] = useState({
        q: "",
        page: 1,
        limit: Global.gDefaultPagination,
        sortByCreateTime: "",
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { tags, isGettingTags, paginationTags } = useSelector(
        (state) => state?.tag
    );

    // MARK: --- Hooks ---
    useEffect(() => {
        dispatch(thunkGetTagList(filters));
    }, [filters, dispatch]);

    return (
        <BaseLayout selected='tag'>
            {/* header */}
            <div className='mx-4'>
                <p className='font-weight-bolder font-size-h1 text-remaining'>
                    Tags
                </p>
                <p className='text-remaining'>
                    Một nhãn tag là một từ khóa để phân loại câu hỏi của bạn với
                    những câu hỏi khác. <br></br> Sử dụng nhãn tag một cách hợp
                    lý sẽ giúp người khác tìm kiếm và trả lời cho những thắc mắc
                    của bạn một cách dễ dàng hơn
                </p>
            </div>

            {/* filter */}
            <div className='d-flex flex-wrap justify-content-between align-items-center mx-4'>
                <div className='max-w-250px'>
                    <BaseSearchBar
                        value={filters.q}
                        name='tag-filter'
                        placeholder='Tìm kiếm...'
                        onSubmit={(value) => {
                            setFilters({ ...filters, q: value });
                        }}
                    />
                </div>
                <div>
                    <DropdownSelect
                        name='workingStatus'
                        options={AppData.tagFilters}
                        value={filters.sortByCreateTime}
                        onValueChanged={(newValue) => {
                            setFilters({
                                ...filters,
                                sortByCreateTime: newValue,
                            });
                        }}
                        label='Bộ lọc'
                    />
                </div>
            </div>
            <div className='row mt-8 mx-0'>
                {isGettingTags ? (
                    <div className='d-flex align-items-center justify-content-center'>
                        <Loading
                            showBackground={false}
                            message='Đang lấy dữ liệu'
                        />
                    </div>
                ) : tags?.length > 0 ? (
                    tags?.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className='col-12 col-md-4 col-lg-3 col-xl-2 mb-7 cursor-pointer'>
                                <CellTag
                                    name={item?.name}
                                    description={item?.description}
                                    numberOfQuestion={item?.numberOfQuestion}
                                    questionPerWeek={item?.questionPerWeek}
                                    questionThisDay={item?.questionThisDay}
                                    clickTag={async () => {
                                        navigate(`/question/tagged/${item?._id}`);
                                    }}
                                />
                            </div>
                        );
                    })
                ) : (
                    <div>
                        <Empty
                            text='Không có kết quả phù hợp'
                            buttonText='Làm mới'
                            visible={false}
                            imageEmpty={
                                AppResource.images.errorStates.noSearchFound
                            }
                        />
                    </div>
                )}
                <div>
                    <div className='d-flex align-items-center justify-content-center mt-0'>
                        <Pagination
                            rowsPerPage={paginationTags.perPage}
                            rowCount={paginationTags.count ?? tags?.length}
                            currentPage={paginationTags.currentPage ?? 1}
                            onChangePage={(newPage) => {
                                let iNewPage = parseInt(newPage);
                                Global.g_needToRefreshTags = true;
                                setFilters({
                                    ...filters,
                                    page: iNewPage,
                                });
                            }}
                            onChangeRowsPerPage={(newPerPage) => {
                                const iNewPerPage = parseInt(newPerPage);
                                dispatch(setPaginationTagPerPage(iNewPerPage));
                                Global.g_needToRefreshTags = true;
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

export default ListTagScreen;
