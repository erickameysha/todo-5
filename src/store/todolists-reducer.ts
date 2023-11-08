import {FilterValuesType, TodolistsType} from "../App";
import {v1} from "uuid";

export type AddTodolistACType =     ReturnType<typeof addTodolistAC>
export type removeTodolistACType =     ReturnType<typeof removeTodolistAC>
type ActionType =
    ReturnType<typeof removeTodolistAC> |
    AddTodolistACType
|
    ReturnType<typeof changeTodolistTitleAC> |
    ReturnType<typeof changeFilterAC>
export const todolistsReducer = (state: Array<TodolistsType>, action: ActionType): TodolistsType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(el => el.id !== action.payload.id)
        }
        case "ADD-TODOLIST": {
            // const newId = v1()
            let newTodo: TodolistsType = {id: action.payload.id, title: action.payload.title, filter: 'all'}
            return [...state, newTodo]
        }
        case "CHANGE-TODOLIST-TITLE": {
            return state.map(el => el.id === action.payload.todolistID ? {...el, title: action.payload.newTitle} : el)
        }
        case "CHANGE-TODOLIST-FILTER":{
            return  state.map(el => el.id === action.payload.todolistID ? {...el, filter: action.payload.value} : el)
        }
        default:
            return state
    }
}


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
