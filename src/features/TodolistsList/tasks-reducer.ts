import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer'
import {
    TaskPriorities,
    TaskStatuses,
    TaskType, TaskTypeEntity,
    todolistsAPI,
    UpdateTaskModelType
} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType} from '../../app/store'
import {RequestStatusType, setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../../app/app-reduce";
import {handleServerAppError, handleServerError} from "../../utils/error-utils";
import axios from "axios";

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK':
            return {
                ...state,
                [action.task.todoListId]: [{...action.task, entityStatus: 'idle'}, ...state[action.task.todoListId]]
            }
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST':
            const copyState = {...state}
            delete copyState[action.id]
            return copyState
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASKS':
            return {...state, [action.todolistId]: action.tasks.map((el) => ({...el, entityStatus: 'idle'}))}
        case "SET-ENTITY":{
            return {...state, [action.todolistId]: state[action.todolistId].map(el=> el.id == action.taskId? {...el, entityStatus: action.status}:el)}
        }
        default:
            return state
    }
}

// actions
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: 'REMOVE-TASK', taskId, todolistId} as const)
export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({type: 'SET-TASKS', tasks, todolistId} as const)
export const setEntityStatusAC = (taskId: string, todolistId: string, status: RequestStatusType) =>
    ({type: 'SET-ENTITY', taskId, todolistId, status} as const)

// thunks
export const fetchTasksTC = (todolistId: string) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC("loading"))
    try {
        const res = await todolistsAPI.getTasks(todolistId)
        console.log(res)
        dispatch(setTasksAC(res.data.items, todolistId))
        dispatch(setAppStatusAC("succeeded"))
    } catch (e) {
        if (axios.isAxiosError<ErrorType>(e)) {
            handleServerError(dispatch, e)
        }
    }

}
export const removeTaskTC = (taskId: string, todolistId: string) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC("loading"))
    dispatch(setEntityStatusAC(taskId, todolistId, 'loading'))
    try {
        const res = await todolistsAPI.deleteTask(todolistId, taskId)
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            const action = removeTaskAC(taskId, todolistId)
            dispatch(action)
            dispatch(setAppStatusAC("succeeded"))
            dispatch(setEntityStatusAC(taskId, todolistId, 'idle'))
        } else {
            handleServerAppError(dispatch, res.data)
            dispatch(setEntityStatusAC(taskId, todolistId, 'idle'))
        }
    } catch (e) {
        if (axios.isAxiosError<ErrorType>(e)) {
            handleServerError(dispatch, e)
            dispatch(setEntityStatusAC(taskId, todolistId, 'idle'))
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
export const addTaskTC = (title: string, todolistId: string) => async (dispatch: Dispatch<ActionsType>) => {

    try {
        const res = await todolistsAPI.createTask(todolistId, title)
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            const task = res.data.data.item
            const action = addTaskAC(task)
            dispatch(action)
            dispatch(setAppStatusAC("succeeded"))
        } else {
            handleServerAppError<{ item: TaskType }>(dispatch, res.data)

        }
    } catch (e) {
        if (axios.isAxiosError<ErrorType>(e))
            handleServerError(dispatch, e)
    }


}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    async (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)

        dispatch(setAppStatusAC("loading"))
        dispatch(setEntityStatusAC(taskId, todolistId, 'loading'))
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
                const action = updateTaskAC(taskId, domainModel, todolistId)
                dispatch(action)
                dispatch(setAppStatusAC("succeeded"))
                dispatch(setEntityStatusAC(taskId, todolistId,'idle'))
            } else {
                if (res.data.messages.length) {
                    dispatch(setAppErrorAC(res.data.messages[0]))
                    dispatch(setEntityStatusAC(taskId, todolistId, 'idle'))
                } else {
                    dispatch(setAppErrorAC('Some error'))
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
type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasksAC>
    | SetAppStatusActionType
    | SetAppErrorActionType
    | ReturnType<typeof setEntityStatusAC>
