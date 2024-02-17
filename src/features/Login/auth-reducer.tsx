import {authAPI} from "../../api/todolists-api";
import {RESULT_CODE, tasksActions} from "../TodolistsList/tasks-reducer";
import {handleServerAppError, handleServerError} from "../../utils/error-utils";
import axios from "axios";
import {appAction} from "../../app/app-reduce";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistsActions} from "../TodolistsList/todolists-reducer";
import {createAppAsyncThunk} from "../../utils/create-app-async-thunk";
import {LoginDataType} from "./Login";

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{ value: boolean }>) => {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: (builder) => {
       builder
           .addCase(meTC.fulfilled, (state,action) =>{
               state.isLoggedIn = action.payload.value
           })
           .addCase(login.fulfilled, (state,action)=>{
               console.log(state)
               state.isLoggedIn = action.payload.value
           })
           .addCase(logOut.fulfilled,(state, )=>{
               console.log(state)
               state.isLoggedIn = false
           })
        }
})


// thunks
const meTC = createAppAsyncThunk<{value:boolean}, void>('auth/meTC', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appAction.setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            dispatch(appAction.setAppStatus({status: 'succeeded'}))
            return {value: true}
        }else{
            handleServerAppError(dispatch,res.data)
            return rejectWithValue(null)
        }
    }catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerError(dispatch, e)
        }
        return rejectWithValue(null)
    } finally {
        dispatch(appAction.setAppIsInitialized({isInitialized: true}))
    }

})

export const login = createAppAsyncThunk<{value: boolean},{data:LoginDataType}>(`${slice.name}/login`, async (arg, thunkAPI)=>{
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appAction.setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.login(arg.data)
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            dispatch(appAction.setAppStatus({status: 'succeeded'}))
          return {value: true}
        } else {
            handleServerAppError(dispatch, res.data)
            return rejectWithValue(null)
        }
    }  catch (e) {
        if (axios.isAxiosError(e))
            handleServerError(dispatch, e)
        return rejectWithValue(null)
    }

})
export const logOut = createAppAsyncThunk<void,void
>(`${slice.name}/logOut`, async (arg, thunkAPI)=>{
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appAction.setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.logOut()
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            dispatch(appAction.setAppStatus({status: 'succeeded'}))
            dispatch(tasksActions.logOut())
            dispatch(todolistsActions.logOut())
            // dispatch(authActions.setIsLoggedIn({value: false}))
        } else {
            handleServerAppError(dispatch, res.data)
            return rejectWithValue(null)
        }
    } catch (e) {
        if (axios.isAxiosError(e))
            handleServerError(dispatch, e)
        return rejectWithValue(null)
    }
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunks = {meTC,login, logOut}