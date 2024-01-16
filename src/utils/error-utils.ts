import {Dispatch} from "redux";
import {ResponseType} from "../api/todolists-api";
import {appAction} from "../app/app-reduce";
import axios from "axios";
import {AppThunk, AppDispatch} from "../app/store";


export const handleServerError= (dispatch:Dispatch, e: { message: string }) => {
    dispatch(appAction.setAppError({error: e.message}))
    dispatch(appAction.setAppStatus({status: 'failed'}))

}
export const handleServerNetworkError = (err: unknown, dispatch: AppDispatch):void => {
    let errorMessage = "Some error occurred";

    // ❗Проверка на наличие axios ошибки
    if (axios.isAxiosError(err)) {
        // ⏺️ err.response?.data?.message - например получение тасок с невалидной todolistId
        // ⏺️ err?.message - например при создании таски в offline режиме
        errorMessage = err.response?.data?.message || err?.message || errorMessage;
        // ❗ Проверка на наличие нативной ошибки
    } else if (err instanceof Error) {
        errorMessage = `Native error: ${err.message}`;
        // ❗Какой-то непонятный кейс
    } else {
        errorMessage = JSON.stringify(err);
    }

    dispatch(appAction.setAppError({ error: errorMessage }));
    dispatch(appAction.setAppStatus({ status: "failed" }));
};
export const handleServerAppError = <D>(dispatch: Dispatch, data: ResponseType<D>) => {
    if (data.messages.length) {
        dispatch(appAction.setAppError({error: data.messages[0]}))
        dispatch(appAction.setAppStatus({status: "succeeded"}))
    } else {
        dispatch(appAction.setAppError({error: 'Some error'}))

    }
    dispatch(appAction.setAppStatus({status:"succeeded"}))

}
