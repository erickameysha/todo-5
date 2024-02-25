import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {authApi} from "features/auth/api/auth.api";
import {RESULT_CODE} from "common/enums";
import {authActions} from "features/auth/model/auth.slice";
import axios from "axios";


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



export const appReducer = slice.reducer
export const appAction = slice.actions
