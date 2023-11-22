import React, {Reducer, useEffect, useReducer, useState} from 'react';
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
    [todlistId:string]: TaskType[]
}
function AppWithReducer() {
    let todolistID1 = v1()
    let todolistID2 = v1()

    let [todolists, dispatchTodolists] = useReducer<Reducer<Array<TodolistsType>, ActionType>>(todolistsReducer,[
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ])

    let [tasks, dispatchTasks] = useReducer<Reducer<TaskStateType, ActionTaskType>>(tasksReducer,{
        [todolistID1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},

        ],
        [todolistID2]: [
            {id: v1(), title: 'Rest API', isDone: true},
            {id: v1(), title: 'GraphQL', isDone: false},
        ]
    })


    function removeTask(todolistId: string, taskId: string) {
        const action = removeTaskAC(taskId,todolistId)
        dispatchTasks(action)
    }

    function addTask(todolistId: string, title: string) {

        dispatchTasks(addTaskAC( title,todolistId))
        // setTasks({...tasks, [todolistId]: [task, ...tasks[todolistId]]})
    }

    function changeStatus(todolistId: string, taskId: string, isDone: boolean) {
        // let task = tasks.find(t => t.id === taskId);
        // if (task) {
        //     task.isDone = isDone;
        // }

        dispatchTasks(changeTaskStatusAC(todolistId,taskId,isDone))
        // setTasks({...tasks, [todolistId]: tasks[todolistId].map(el => el.id === taskId ? {...el, isDone} : el)});
    }

    const changeTaskTitle = (todolistID: string, newTitle: string, taskId: string) => {
        // setTasks({
        //     ...tasks,
        //     [todolistID]: tasks[todolistID].map(el => el.id === taskId ? {...el, title: newTitle} : el)
        // })
        dispatchTasks(changeTaskTitleAC(todolistID, taskId,newTitle))
    }
    const changeTodolistTitle = (todolistID: string, newTitle: string) => {
        // setTasks({
        //     ...tasks,
        //     [todolistID]: tasks[todolistID].map(el => el.id === taskId ? {...el, title: newTitle} : el)
        // })
        dispatchTodolists(changeTodolistTitleAC(todolistID,newTitle))
        // setTodolists(todolists.map(el=> el.id === todolistID? {...el, title: newTitle}: el ))
    }

    function changeFilter(todolistID: string, value: FilterValuesType) {
        // setFilter();
        // setTodolist([...todolist, todolist.map(el=> el.id ===todoli)])
        // todolist.filter(el => el.filter === value)
        dispatchTodolists(changeFilterAC(todolistID, value))
        // setTodolists(todolists.map(el => el.id === todolistID ? {...el, filter: value} : el))
    }

    const removeTodolist = (todolistId: string) => {
        const action = removeTodolistAC(todolistId)
        dispatchTodolists(action)
        dispatchTasks(action)
    }
    const addTodolist = (title: string) => {
const action =  addTodolistAC(title)
        dispatchTodolists(action)
        dispatchTasks(action)

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

export default AppWithReducer;
