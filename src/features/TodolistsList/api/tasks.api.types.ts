import {TaskPriorities, TaskStatuses} from "common/enums";
import {RequestStatusType} from "app/app-reduce";


export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
export type TaskTypeEntity = TaskType & {
    entityStatus: RequestStatusType
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}
export type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}
export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
