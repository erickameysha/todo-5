import {todolistsAPI, TodolistType} from '../../api/todolists-api'import {    appAction, RequestStatusType,} from "../../app/app-reduce";import {ErrorType, RESULT_CODE} from "./tasks-reducer";import {handleServerAppError, handleServerError} from "../../utils/error-utils";import axios from "axios";import {createSlice, PayloadAction} from "@reduxjs/toolkit";import {AppThunk} from "../../app/store";const slice = createSlice({    name: 'todolist',    initialState: [] as TodolistDomainType[],    reducers: {        removeTodolist: (state, action: PayloadAction<{ id: string }>) => {            // return state.filter(tl => tl.id !== action.id)            const index = state.findIndex(el => el.id == action.payload.id)            if (index !== -1) state.splice(index, 1)        },        addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})        },        changeTodolistTitle: (state, action: PayloadAction<{ id: string, title: string }>) => {            const index = state.findIndex(el => el.id == action.payload.id)            if (index !== -1) state[index].title = action.payload.title        },        changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {            const index = state.findIndex(el => el.id == action.payload.id)            if (index !== -1) state[index].filter = action.payload.filter        },        setEntityStatus: (state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) => {            const index = state.findIndex(el => el.id == action.payload.id)            if (index !== -1) state[index].entityStatus = action.payload.entityStatus        },        setTodolists: (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {            return action.payload.todolists.map((tl: any) => ({...tl, filter: 'all', entityStatus: 'idle'}))        },        logOut:(state)=>{           return  [];    }}})export const todolistsReducer = slice.reducerexport const todolistsActions = slice.actions// thunksexport const fetchTodolistsTC = (): AppThunk => (dispatch) => {    dispatch(appAction.setAppStatus({status: 'loading'}))    todolistsAPI.getTodolists()        .then((res) => {            dispatch(todolistsActions.setTodolists({todolists: res.data}))            dispatch(appAction.setAppStatus({status: 'succeeded'}))        }) }export const removeTodolistTC = (todolistId: string): AppThunk => async (dispatch) => {    dispatch(appAction.setAppStatus({status: 'loading'}))    dispatch(todolistsActions.setEntityStatus({id: todolistId, entityStatus: "loading"}))    try {        const res = await todolistsAPI.deleteTodolist(todolistId)        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {            dispatch(appAction.setAppStatus({status: 'succeeded'}))            dispatch(todolistsActions.setEntityStatus({id:todolistId, entityStatus: "idle"}))            dispatch(todolistsActions.removeTodolist({id:todolistId}))        } else {            handleServerAppError(dispatch, res.data)        }    } catch (e) {        if (axios.isAxiosError<ErrorType>(e))            handleServerError(dispatch, e)    }}export const addTodolistTC = (title: string): AppThunk => async (dispatch) => {    dispatch(appAction.setAppStatus({status: 'loading'}))    try {        const res = await todolistsAPI.createTodolist(title)        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {            dispatch(appAction.setAppStatus({status: 'succeeded'}))            dispatch(todolistsActions.addTodolist({todolist:res.data.data.item}))        } else {            handleServerAppError(dispatch, res.data)        }    } catch (e) {        if (axios.isAxiosError<ErrorType>(e)) {            handleServerError(dispatch, e)        }    }}export const changeTodolistTitleTC = (id: string, title: string): AppThunk => async (dispatch) => {    dispatch(appAction.setAppStatus({status: 'loading'}))    try {        const res = await todolistsAPI.updateTodolist(id, title)        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {            dispatch(todolistsActions.changeTodolistTitle({id, title}))            dispatch(appAction.setAppStatus({status: 'succeeded'}))        } else {            handleServerAppError(dispatch, res.data)        }    } catch (e) {        if (axios.isAxiosError<ErrorType>(e)) {            handleServerError(dispatch, e)        }    }}// typesexport type FilterValuesType = 'all' | 'active' | 'completed';export type TodolistDomainType = TodolistType & {    filter: FilterValuesType,    entityStatus: RequestStatusType}