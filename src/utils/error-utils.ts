import {setAppErrorAC, SetErrorType, setStatusAC, SetStatusType} from "../app/app-reduce";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolists-api";


export const handleServerError = (dispatch: ErrorUtilsDispatchType, e: { message: string }) => {
    dispatch(setAppErrorAC(e.message))
    dispatch(setStatusAC('failed'))

}
export const handleServerAppError = <D>(dispatch:ErrorUtilsDispatchType, data: ResponseType<D>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
        dispatch(setStatusAC("succeeded"))
    } else {
        dispatch(setAppErrorAC('Some error'))

    }
    dispatch(setStatusAC("succeeded"))
  
}
type ErrorUtilsDispatchType = Dispatch<SetStatusType
    | SetErrorType>