import {setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../app/app-reduce";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolists-api";


export const handleServerError = (dispatch: ErrorUtilsDispatchType, e: { message: string }) => {
    dispatch(setAppErrorAC(e.message))
    dispatch(setAppStatusAC('failed'))

}
export const handleServerAppError = <D>(dispatch:ErrorUtilsDispatchType, data: ResponseType<D>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
        dispatch(setAppStatusAC("succeeded"))
    } else {
        dispatch(setAppErrorAC('Some error'))

    }
    dispatch(setAppStatusAC("succeeded"))
  
}
type ErrorUtilsDispatchType = Dispatch<SetAppStatusActionType
    | SetAppErrorActionType>