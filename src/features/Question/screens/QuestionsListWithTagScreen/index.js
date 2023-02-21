import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import "./style.scss";
import MiniProfile from "general/components/MiniProfile";
import BaseLayout from "general/components/BaseLayout";
import { useEffect } from "react";
import Utils from "general/utils/Utils";
import BaseSearchBar from "general/components/Form/BaseSearchBar";
import { useState } from "react";
import Loading from "general/components/Loading";
import Empty from "general/components/Empty";
import AppResource from "general/constants/AppResource";
import {
    setPaginationQuestionPerPage,
    thunkGetDetailQuestion,
    thunkGetQuestionsList,
    thunkVoteQuestion,
} from "features/Question/questionSlice";
import SummaryQuestion from "features/Question/Component/SummaryQuestion";
import Global from "general/utils/Global";
import Pagination from "general/components/Pagination";
import { useNavigate } from "react-router-dom";
import questionApi from "api/questionApi";
import useRouter from "Hooks/useRouter";
import { thunkGetTagDetail } from "features/TagScreen/tagSlice";

QuestionsListWithTagScreen.propTypes = {};

function QuestionsListWithTagScreen(props) {
    const [filters, setFilters] = useState({
        q: "",
        page: 1,
        limit: Global.gDefaultPagination,
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const router = useRouter();
    const { currentAccount } = useSelector((state) => state?.auth);
    const { detailTag } = useSelector((state) => state?.tag);
    const { isGettingQuestionsList, questionsList, paginationListQuestion } =
        useSelector((state) => state?.question);
    const tagId = router.query?._id;
    useEffect(() => {
        dispatch(thunkGetQuestionsList({ ...filters, tagId: tagId }));
        dispatch(thunkGetTagDetail({ tagId: tagId }));
    }, [filters, tagId]);
    return (
        <BaseLayout selected="questions">
            <div className="container-xxl">
                <h1>Danh sách câu hỏi được gắn thẻ [{detailTag?.name}]</h1>
                <p className="text-remaining" style={{fontSize:"1.1rem"}}>
                {detailTag?.description}
                </p>
                <div className="max-w-200px">
                    <BaseSearchBar
                        placeholder="Tìm kiếm câu hỏi"
                        value={filters.q}
                        name="questionFilter"
                        onSubmit={(value) => {
                            setFilters({ ...filters, q: value });
                        }}
                    />
                </div>
                <div>
                    {isGettingQuestionsList ? (
                        <div className="d-flex align-items-center justify-content-center mt-8">
                            <Loading
                                showBackground={false}
                                message="Đang lấy dữ liệu"
                            />
                        </div>
                    ) : questionsList?.length > 0 ? (
                        questionsList?.map((item, index) => {
                            return (
                                <div className="custom-cell" key={index}>
                                    <SummaryQuestion
                                        tags={item?.tagIds}
                                        avatar={item?.account?.avatar?.path}
                                        userName={item?.account?.fullname}
                                        createAt={Utils.formatDateTime(
                                            item?.createdAt,
                                            "DD-MM-YYYY"
                                        )}
                                        titleQuestion={item?.title}
                                        comments="15"
                                        likes={item?.likeCount ?? 0}
                                        colorIconLike={
                                            item?.likes.includes(
                                                currentAccount._id
                                            ) && "text-primary"
                                        }
                                        colorIconDislike={
                                            item?.dislikes.includes(
                                                currentAccount._id
                                            ) && "text-danger"
                                        }
                                        dislikes={item?.dislikeCount ?? 0}
                                        clickQuestion={async () => {
                                            navigate(
                                                `/question/detail/${item?._id}`
                                            );
                                        }}
                                        clickLike={() => {
                                            // await questionApi.voteQuestion({
                                            //     _id: item?._id,
                                            //     reactType: 1,
                                            // });
                                            // await dispatch(thunkGetQuestionsList(filters));
                                            dispatch(
                                                thunkVoteQuestion({
                                                    _id: item?._id,
                                                    reactType: 1,
                                                })
                                            );
                                        }}
                                        clickDislike={() => {
                                            dispatch(
                                                thunkVoteQuestion({
                                                    _id: item?._id,
                                                    reactType: 0,
                                                })
                                            );
                                        }}
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <div className="mt-8">
                            <Empty
                                text="Không có kết quả phù hợp"
                                buttonText="Làm mới"
                                visible={false}
                                imageEmpty={
                                    AppResource.images.errorStates.noMatchFound
                                }
                            />
                        </div>
                    )}
                    <div>
                        {questionsList?.length > 0 && (
                            <div className="d-flex align-items-center justify-content-center mt-0">
                                <Pagination
                                    rowsPerPage={paginationListQuestion.perPage}
                                    rowCount={
                                        paginationListQuestion.count ??
                                        questionsList?.length
                                    }
                                    currentPage={
                                        paginationListQuestion.currentPage ?? 1
                                    }
                                    onChangePage={(newPage) => {
                                        let iNewPage = parseInt(newPage);
                                        Global.g_needToRefreshQuestions = true;
                                        setFilters({
                                            ...filters,
                                            page: iNewPage,
                                        });
                                    }}
                                    onChangeRowsPerPage={(newPerPage) => {
                                        const iNewPerPage =
                                            parseInt(newPerPage);
                                        dispatch(
                                            setPaginationQuestionPerPage(
                                                iNewPerPage
                                            )
                                        );
                                        Global.g_needToRefreshQuestions = true;
                                        setFilters({
                                            ...filters,
                                            page: 1,
                                            limit: iNewPerPage,
                                        });
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
}

export default QuestionsListWithTagScreen;
