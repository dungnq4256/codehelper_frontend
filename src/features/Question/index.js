import Empty from "general/components/Empty";
import AppResource from "general/constants/AppResource";
import { Navigate, Route, Routes } from "react-router-dom";
import CreateQuestionScreen from "./screens/CreateQuestionScreen";
import QuestionDetailScreen from "./screens/QuestionDetailScreen";
import QuestionsListScreen from "./screens/QuestionsListScreen";
import QuestionsListWithTagScreen from "./screens/QuestionsListWithTagScreen";

function Question(props) {
    // MARK: --- Params ---

    return (
        <Routes>
            <Route path='' element={<Navigate to='list' />} />
            <Route path='list' element={<QuestionsListScreen />} />
            <Route path='create' element={<CreateQuestionScreen />} />
            <Route path='detail/:_id' element={<QuestionDetailScreen />} />
            <Route path='tagged/:_id' element={<QuestionsListWithTagScreen />} />

            <Route
                path='*'
                element={
                    <Empty
                        text='Page Not Found'
                        buttonText='Làm mới'
                        visible={false}
                        imageEmpty={AppResource.images.errorStates.pageNotFound}
                    />
                }
            />
        </Routes>
    );
}

export default Question;
