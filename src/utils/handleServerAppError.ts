import {Dispatch} from "redux";

import {appAction} from "../app/app-reduce";
import {BaseResponseType} from "../common/types";

export const handleServerAppError = <D>(dispatch: Dispatch, data: BaseResponseType<D>) => {
    if (data.messages.length) {
        dispatch(appAction.setAppError({error: data.messages[0]}))
        dispatch(appAction.setAppStatus({status: "succeeded"}))
    } else {
        dispatch(appAction.setAppError({error: 'Some error'}))

    }
    dispatch(appAction.setAppStatus({status:"succeeded"}))

}
