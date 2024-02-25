
 import axios, {AxiosResponse} from 'axios'
import {RequestStatusType} from "app/app-reduce";
 import {instance} from "common/api";
 import {TaskPriorities, TaskStatuses} from "common/enums";
 import {BaseResponseType} from "common/types";
 import {GetTasksResponse, TaskType, UpdateTaskModelType} from "features/TodolistsList/api/tasksApi.types";


// api

export const tasksAPI = {
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<BaseResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
    },
    createTask(todolistId: string, title: string) {
        return instance.post<BaseResponseType<{ item: TaskType }>, AxiosResponse<BaseResponseType<{ item: TaskType }>>, {
            title: string
        }>(`todo-lists/${todolistId}/tasks`, {title});
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<BaseResponseType<{ item: TaskType }>, AxiosResponse<BaseResponseType<{
            item: TaskType
        }>>, UpdateTaskModelType>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    }
}

// types


