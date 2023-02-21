import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import BaseSearchBar from "general/components/Form/BaseSearchBar";
import AppButton from "general/components/AppButton";
import Loading from "general/components/Loading";
import CellTag from "features/TagScreen/components/CellTag";
import Empty from "general/components/Empty";
import AppResource from "general/constants/AppResource";
import Global from "general/utils/Global";
import { parseInt } from "lodash";
import {
    setPaginationTagListOfUserPerPage,
    thunkGetTagListOfUser,
} from "features/TagScreen/tagSlice";
import Pagination from "general/components/Pagination";
import ModalCreateTag from "features/TagScreen/components/ModalCreateTag";
import ModalEditTag from "features/TagScreen/components/ModalEditTag";
import tagApi from "api/tagApi";
import DialogModal from "general/components/DialogModal";
import ToastHelper from "general/helpers/ToastHelper";
import { useNavigate } from "react-router-dom";
import useRouter from "Hooks/useRouter";

AccounttagScreen.propTypes = {};

function AccounttagScreen(props) {
    const [filters, setFilters] = useState({
        q: "",
        page: 1,
        limit: Global.gDefaultPagination,
        sortByCreateTime: "",
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const router = useRouter();
    const [showModalCreateTag, setShowModalCreateTag] = useState(false);
    const [showModalEditTag, setShowModalEditTag] = useState(false);
    const [showModalDeleteTag, setShowModalDeleteTag] = useState(false);
    const [selectedTag, setSelectedTag] = useState({});
    const { currentAccount } = useSelector((state) => state?.auth);
    const { tagsListOfUser, isGettingTags, paginationTagsListOfUser } =
        useSelector((state) => state?.tag);
    const accountId = router.query?.accountId;
    async function handleDeleteTag() {
        const res = await tagApi.deleteTag({
            _id: selectedTag?._id,
        });
        // console.log(res);
        if (res.result === "success") {
            ToastHelper.showSuccess(`Xóa thẻ ${selectedTag?.name} thành công`);
            await dispatch(thunkGetTagListOfUser());
        }
    }

    // MARK: --- Hooks ---
    useEffect(() => {
        dispatch(thunkGetTagListOfUser({ ...filters, _id: accountId }));
    }, [filters, dispatch]);
    return (
        <div>
            <div className="d-flex flex-wrap justify-content-between align-items-center mx-4">
                <div className="max-w-250px">
                    <BaseSearchBar
                        value={filters.q}
                        name="tag-filter"
                        placeholder="Tìm kiếm..."
                        onSubmit={(value) => {
                            setFilters({ ...filters, q: value });
                        }}
                    />
                </div>
                {currentAccount?._id === accountId ? (
                    <div>
                        <AppButton
                            className="btn-blue"
                            text="Thêm thẻ mới"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowModalCreateTag(true);
                            }}
                        />
                    </div>
                ) : null}
            </div>
            <div className="row mt-8 mx-0">
                {isGettingTags ? (
                    <div className="d-flex align-items-center justify-content-center">
                        <Loading
                            showBackground={false}
                            message="Đang lấy dữ liệu"
                        />
                    </div>
                ) : tagsListOfUser?.length > 0 ? (
                    tagsListOfUser?.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className="col-12 col-md-4 col-lg-3 mb-7 cursor-pointer"
                            >
                                <CellTag
                                    name={item?.name}
                                    isMyTag={
                                        currentAccount?._id === accountId ? (
                                            <div className="d-flex align-items-center mb-2">
                                                <a
                                                    className="btn btn-icon btn-sm btn-light-primary btn-hover-primary mr-2"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedTag(item);
                                                        setShowModalEditTag(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <i className="far fa-pen p-0 icon-1x" />
                                                </a>
                                                <a
                                                    className="btn btn-icon btn-sm btn-light-danger btn-hover-danger"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedTag(item);
                                                        setShowModalDeleteTag(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <i className="far fa-trash p-0 icon-1x" />
                                                </a>
                                            </div>
                                        ) : null
                                    }
                                    description={item?.description}
                                    numberOfQuestion={item?.numberOfQuestion}
                                    questionPerWeek={item?.questionPerWeek}
                                    questionThisDay={item?.questionThisDay}
                                    clickTag={async () => {
                                        navigate(
                                            `/question/tagged/${item?._id}`
                                        );
                                    }}
                                />
                            </div>
                        );
                    })
                ) : (
                    <div>
                        <Empty
                            text="Không có kết quả phù hợp"
                            buttonText="Làm mới"
                            visible={false}
                            imageEmpty={
                                AppResource.images.errorStates.noSearchFound
                            }
                        />
                    </div>
                )}
                <div>
                    <div className="d-flex align-items-center justify-content-center mt-0">
                        <Pagination
                            rowsPerPage={paginationTagsListOfUser.perPage}
                            rowCount={
                                paginationTagsListOfUser.count ??
                                tagsListOfUser?.length
                            }
                            currentPage={
                                paginationTagsListOfUser.currentPage ?? 1
                            }
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
                                dispatch(
                                    setPaginationTagListOfUserPerPage(
                                        iNewPerPage
                                    )
                                );
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
            <ModalCreateTag
                onClose={() => setShowModalCreateTag(false)}
                show={showModalCreateTag}
            />
            <ModalEditTag
                onClose={() => setShowModalEditTag(false)}
                show={showModalEditTag}
                tagItem={selectedTag}
            />
            <DialogModal
                title="Xóa Thẻ"
                description={`Bạn có chắc muốn xóa thẻ ${selectedTag?.name}`}
                show={showModalDeleteTag}
                onClose={() => setShowModalDeleteTag(false)}
                onExecute={handleDeleteTag}
            />
        </div>
    );
}

export default AccounttagScreen;
