import {handleServerNetworkError} from "common/utils/handleServerNetworkError";
import {BaseResponseType} from "common/types";
import {AppRootStateType, AppThunkDispatch} from "app/store";
import {BaseThunkAPI} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {appAction} from "app/app-reduce";

export const thunkTryCatch = async <T>(
    thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppThunkDispatch, null | BaseResponseType>,
    logic: () => Promise<T>
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appAction.setAppStatus({ status: "loading" }));
    try {
        return await logic();
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null);
    } finally {
        dispatch(appAction.setAppStatus({ status: "idle" }));
    }
};