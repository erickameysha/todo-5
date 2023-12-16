import {v1} from "uuid";
import {TaskStatuses, todolistAPI, TodolistType} from "./todolistApi";
import {AnyAction, Dispatch} from "redux";

export type AddTodolistACType = ReturnType<typeof addTodolistAC>
export type removeTodolistACType = ReturnType<typeof removeTodolistAC>
export type setTodolistACType = ReturnType<typeof setTodolistAC>
export type ActionType =
    ReturnType<typeof removeTodolistAC> |
    AddTodolistACType |
    ReturnType<typeof changeTodolistTitleAC> |
    setTodolistACType|
    ReturnType<typeof changeFilterAC>
export type FilterValuesType = "all" | "active" | "completed";
const initState: TodolistDomainType[] = []
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}
export const todolistsReducer = (state = initState, action: ActionType): TodolistDomainType[] => {
    switch (action.type) {
        case "SET-TODOLIST":{
            return action.payload.todolists.map((tl)=>({...tl, filter: 'all'}))
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(el => el.id !== action.payload.id)
        }
        case "ADD-TODOLIST": {
            // const newId = v1()
            let newTodo: TodolistDomainType = {
                id: action.payload.id,
                title: action.payload.title,
                order: TaskStatuses.New,
                addedDate: new Date().toTimeString(),
                filter: "all"

            }
            return [...state, newTodo]
        }
        case "CHANGE-TODOLIST-TITLE": {
            return state.map(el => el.id === action.payload.todolistID ? {...el, title: action.payload.newTitle} : el)
        }
        case "CHANGE-TODOLIST-FILTER": {
            return state.map(el => el.id === action.payload.todolistID ? {...el, filter: action.payload.value} : el)
        }
        default:
            return state
    }
}


export const setTodolistAC = (todolists: TodolistType[]) => ({
    type: 'SET-TODOLIST', payload: {todolists}

} as const)
export const removeTodolistAC = (id: string) => ({
    type: 'REMOVE-TODOLIST', payload: {id}

} as const)
export const addTodolistAC = (title: string) => ({
    type: 'ADD-TODOLIST', payload: {title, id: v1()}

} as const)
export const changeTodolistTitleAC = (todolistID: string, newTitle: string) => ({
    type: 'CHANGE-TODOLIST-TITLE', payload: {newTitle, todolistID}

} as const)
export const changeFilterAC = (todolistID: string, value: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER', payload: {value, todolistID}

} as const)

export const setTodolistTC=() => (dispatch: Dispatch)=> {
    todolistAPI.getTodolists().then(res => dispatch(setTodolistAC(res.data)))
}
export const addTodolistTC=(title: string) => (dispatch: Dispatch)=> {
    todolistAPI.createTodolist(title).then(() => dispatch(addTodolistAC(title)))
}