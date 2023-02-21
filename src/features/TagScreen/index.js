import PrivateRoute from "general/components/AppRoutes/PrivateRoute";
import Empty from "general/components/Empty";
import AppResource from "general/constants/AppResource";
import { Navigate, Route, Routes } from "react-router-dom";
import CreateTagScreen from "./screens/CreateTagScreen";
import ListTagScreen from "./screens/ListTagScreen";

function Tag(props) {
    // MARK: --- Params ---

    return (
        <Routes>
            <Route path='' element={<Navigate to='list' />} />
            <Route path='list' element={<ListTagScreen />} />
            <Route
                path='create'
                element={
                    <PrivateRoute>
                        <CreateTagScreen />
                    </PrivateRoute>
                }
            />

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

export default Tag;
