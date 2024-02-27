
 import axios, {AxiosResponse} from 'axios'
import {RequestStatusType} from "app/app-reduce";
 import {instance} from "common/api";
 import {TaskPriorities, TaskStatuses} from "common/enums";
 import {BaseResponseType} from "common/types";
 import {TodolistType} from "features/TodolistsList/api/tasks.api.types";


// api

export const todolistsAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists');
    },
    createTodolist(title: string) {
        return instance.post<BaseResponseType<{ item: TodolistType }>, AxiosResponse<BaseResponseType<{
            item: TodolistType
        }>>, { title: string }>('todo-lists', {title});
    },
    deleteTodolist(id: string) {
        return instance.delete<BaseResponseType>(`todo-lists/${id}`);
    },
    updateTodolist(id: string, title: string) {
        return instance.put<BaseResponseType, AxiosResponse<BaseResponseType>, { title: string }>(`todo-lists/${id}`, {title});
    },
}





