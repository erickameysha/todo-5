import {
    TaskPriorities,
    TaskStatuses,
    TaskType, TaskTypeEntity,
    todolistsAPI,
    UpdateTaskModelType
} from '../../api/todolists-api'
import {AppRootStateType, AppThunk} from '../../app/store'
import {appAction, RequestStatusType} from "../../app/app-reduce";
import {handleServerAppError, handleServerError} from "../../utils/error-utils";
import axios from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistsActions} from "./todolists-reducer";

const slice = createSlice({
    name: "tasks",
    initialState: {} as TasksStateType,
    reducers: {
        removeTask: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex((task) => task.id === action.payload.taskId)
            if (index !== -1) {
                tasks.splice(index, 1)
            }
        },
        addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
            const tasks = state[action.payload.task.todoListId]
            tasks.unshift({...action.payload.task, entityStatus: 'idle'})
        },
        updateTask: (
            state,
            action: PayloadAction<{
                taskId: string
                model: UpdateDomainTaskModelType
                todolistId: string
            }>,
        ) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex((task) => task.id === action.payload.taskId)
            if (index !== -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        setTasks: (state, action: PayloadAction<{ tasks: Array<TaskType>; todolistId: string }>) => {
            state[action.payload.todolistId] = action.payload.tasks.map(el => ({...el, entityStatus: 'idle'}))
        },
        setEntityStatus: (state, action: PayloadAction<{ taskId: string, todolistId: string, status: RequestStatusType }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex((task) => task.id === action.payload.taskId)
            if (index !== -1) {
                tasks[index].entityStatus = action.payload.status
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(todolistsActions.addTodolist, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistsActions.removeTodolist, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(todolistsActions.setTodolists, (state, action) => {
                action.payload.todolists.forEach((tl: any) => {
                    state[tl.id] = []
                })
            })
    },
})

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions


// thunks
export const fetchTasksTC = (todolistId: string): AppThunk => async (dispatch) => {
    dispatch(appAction.setAppStatus({status: 'loading'}))
    try {
        const res = await todolistsAPI.getTasks(todolistId)
        console.log(res)
        dispatch(tasksActions.setTasks({tasks: res.data.items, todolistId: todolistId}))
        dispatch(appAction.setAppStatus({status: 'succeeded'}))
    } catch (e) {
        if (axios.isAxiosError<ErrorType>(e)) {
            handleServerError(dispatch, e)
        }
    }

}
export const removeTaskTC = (taskId: string, todolistId: string): AppThunk => async (dispatch) => {
    dispatch(appAction.setAppStatus({status: 'loading'}))
    dispatch(tasksActions.setEntityStatus({taskId, todolistId, status: 'loading'}))
    try {
        const res = await todolistsAPI.deleteTask(todolistId, taskId)
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            const action = tasksActions.removeTask({taskId, todolistId})
            dispatch(action)
            dispatch(appAction.setAppStatus({status: 'succeeded'}))
            dispatch(tasksActions.setEntityStatus({taskId, todolistId, status: 'idle'}))
        } else {
            handleServerAppError(dispatch, res.data)
            dispatch(tasksActions.setEntityStatus({taskId, todolistId, status: 'idle'}))
        }
    } catch (e) {
        if (axios.isAxiosError<ErrorType>(e)) {
            handleServerError(dispatch, e)
            dispatch(tasksActions.setEntityStatus({taskId, todolistId, status: 'idle'}))
        }
    }


}

export enum RESULT_CODE {
    SUCCEDED = 0,
    FAILED = 1,
    RECAPTCHA_FAILED = 10
}

export type ErrorType = {
    message: string,
    field: string,
    code: string
}
export const addTaskTC = (title: string, todolistId: string): AppThunk => async (dispatch) => {

    try {
        const res = await todolistsAPI.createTask(todolistId, title)
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            const task = res.data.data.item
            const action = tasksActions.addTask({task: task})
            dispatch(action)
            dispatch(appAction.setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError<{ item: TaskType }>(dispatch, res.data)

        }
    } catch (e) {
        if (axios.isAxiosError<ErrorType>(e))
            handleServerError(dispatch, e)
    }


}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
    async (dispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)

        dispatch(appAction.setAppStatus({status: 'loading'}))
        dispatch(tasksActions.setEntityStatus({taskId, todolistId, status: 'loading'}))
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }
        try {
            const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel)
            if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                const action = tasksActions.updateTask({taskId, model: domainModel, todolistId})
                dispatch(action)
                dispatch(appAction.setAppStatus({status: 'succeeded'}))
                dispatch(tasksActions.setEntityStatus({taskId, todolistId, status: 'idle'}))
            } else {
                if (res.data.messages.length) {
                    dispatch(appAction.setAppError({error: res.data.messages[0]}))
                    dispatch(tasksActions.setEntityStatus({taskId, todolistId, status: 'idle'}))
                } else {
                    dispatch(appAction.setAppError({error: 'Some error'}))
                }

            }
        } catch (e) {
            if (axios.isAxiosError<ErrorType>(e)) {
                handleServerError(dispatch, e)
            } else {
                const error = (e as { message: string })
                handleServerError(dispatch, error)
            }
        }

    }

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskTypeEntity>
}
