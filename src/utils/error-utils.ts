import {Dispatch} from "redux";
import {ResponseType} from "../api/todolists-api";
import {appAction} from "../app/app-reduce";


export const handleServerError= (dispatch:Dispatch, e: { message: string }) => {
    dispatch(appAction.setAppError({error: e.message}))
    dispatch(appAction.setAppStatus({status: 'failed'}))

}
export const handleServerAppError = <D>(dispatch: Dispatch, data: ResponseType<D>) => {
    if (data.messages.length) {
        dispatch(appAction.setAppError({error: data.messages[0]}))
        dispatch(appAction.setAppStatus({status: "succeeded"}))
    } else {
        dispatch(appAction.setAppError({error: 'Some error'}))

    }
    dispatch(appAction.setAppStatus({status:"succeeded"}))

}
