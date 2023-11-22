import React, {Reducer, useReducer} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';
import Input from "./Input";
import {
    ActionType, addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from "./store/todolists-reducer";
import {
    ActionTaskType,
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    tasksReducer
} from "./store/tast-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store/store";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistsType = {
    id: string,
    title: string,
    filter: FilterValuesType
}
export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

export type TaskStateType = {
    [todlistId: string]: TaskType[]
}

function AppWithRedux() {
  
    const todolists = useSelector<AppRootStateType, TodolistsType[]>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)

    const dispatch = useDispatch()

    function removeTask(todolistId: string, taskId: string) {
        const action = removeTaskAC(taskId, todolistId)
        dispatch(action)
    }

    function addTask(todolistId: string, title: string) {

        dispatch(addTaskAC(title, todolistId))
    }

    function changeStatus(todolistId: string, taskId: string, isDone: boolean) {
        dispatch(changeTaskStatusAC(todolistId, taskId, isDone))

    }

    const changeTaskTitle = (todolistID: string, newTitle: string, taskId: string) => {
        dispatch(changeTaskTitleAC(todolistID, taskId, newTitle))
    }
    const changeTodolistTitle = (todolistID: string, newTitle: string) => {
        dispatch(changeTodolistTitleAC(todolistID, newTitle))

    }

    function changeFilter(todolistID: string, value: FilterValuesType) {
        dispatch(changeFilterAC(todolistID, value))

    }

    const removeTodolist = (todolistId: string) => {
        const action = removeTodolistAC(todolistId)
        dispatch(action)
        // dispatchTasks(action)
    }
    const addTodolist = (title: string) => {
        const action = addTodolistAC(title)
        dispatch(action)
        // dispatchTasks(action)

    }

    return (
        <div className="App">
            <div>
                <Input callback={addTodolist}/>
            </div>
            {todolists.map(el => {

                let tasksForTodolist = tasks[el.id];

                if (el.filter === "active") {
                    tasksForTodolist = tasks[el.id].filter(t => !t.isDone);
                }
                if (el.filter === "completed") {
                    tasksForTodolist = tasks[el.id].filter(t => t.isDone);
                }
                return <Todolist
                    todolistID={el.id}
                    key={el.id}
                    title={el.title}
                    tasks={tasksForTodolist}
                    removeTask={removeTask}
                    changeFilter={changeFilter}
                    addTask={addTask}
                    changeTaskStatus={changeStatus}
                    removeTodolist={removeTodolist}
                    changeTaskTitle={changeTaskTitle}
                    changeTodolistTitle={changeTodolistTitle}
                    filter={el.filter}
                />
            })}

        </div>
    );
}

export default AppWithRedux;
