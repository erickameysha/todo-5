import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "utils";
import {authAPI} from "features/Login/authAPI";
import {RESULT_CODE} from "common/enums";
import axios from "axios/index";
import {authActions} from "features/Login/auth-reducer";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'



const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'loading' as RequestStatusType,
        error: null as null | string,
        isInitialized: null as null | boolean
    },
    reducers: {
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setAppIsInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        }
    }
})

const initializeApp = createAppAsyncThunk(`${slice.name}/initializeApp`,async (arg, thunkAPI)=>{
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appAction.setAppStatus({status: 'loading'}))

    try {
        const res = await authAPI.me()
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            dispatch(authActions.setIsLoggedIn({value: true}))
            return {value: true}
        }else{
            handleServerAppError(dispatch,res.data)
            return rejectWithValue(null)
        }
    }catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError( e, dispatch,)
        }
        return rejectWithValue(null)
    } finally {
        dispatch(appAction.setAppIsInitialized({isInitialized: true}))
    }


} )

export const appReducer = slice.reducer
export const appAction = slice.actions
