 import React, {ChangeEvent} from 'react'
 import {FilterValuesType} from "./App";
 import EditableSpan from "./EditableSpan";
 import Input from "./Input";
 type TaskType = {
     id: string
     title: string
     isDone: boolean
 }

type PropsType = {
    todolistID: string
    title: string
    tasks: Array<TaskType>
    removeTask: (todolistId: string, taskId: string) => void
    changeFilter: (todolistId: string, value: FilterValuesType) => void
    addTask: (todolistId: string, title: string) => void
    changeTaskStatus: (toodlistId: string, taskId: string, isDone: boolean) => void
    removeTodolist: (todolistId: string) => void
    changeTaskTitle: (todolistID: string, newTitle: string, taskId: string) => void
    changeTodolistTitle: (todolistID: string, newTitle: string) => void
    filter: FilterValuesType
}

export function Todolist(props: PropsType) {
    const removeTodolist = () => {
        props.removeTodolist(props.todolistID)
    }
    const onAllClickHandler = () => props.changeFilter(props.todolistID, "all");
    const onActiveClickHandler = () => props.changeFilter(props.todolistID, "active");
    const onCompletedClickHandler = () => props.changeFilter(props.todolistID, "completed");

    const addTask = (title: string) => {
        props.addTask(props.todolistID, title)
    }
    const onChangeTaskTitle = (title: string, taskID: string) => {
        props.changeTaskTitle(props.todolistID, title, taskID)
    }
    const onChangeTodolistTitle = (title: string) => {
props.changeTodolistTitle(props.todolistID, title)
    }
    return <div>
        <h3>
            <EditableSpan title={props.title} onClick={onChangeTodolistTitle}/>
            <button onClick={removeTodolist}>x</button>
        </h3>
        <div>
            <Input callback={addTask}/>
        </div>
        <ul>
            {
                props.tasks.map(t => {
                    const onClickHandler = () => props.removeTask(props.todolistID, t.id)
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(props.todolistID, t.id, e.currentTarget.checked);
                    }
                    const changeTitle = (title: string) => {
                        onChangeTaskTitle(title, t.id)
                    }
                    return <li style={{display: 'flex', paddingBottom: '5px'}} key={t.id}
                               className={t.isDone ? "is-done" : ""}>
                        <input type="checkbox"
                               onChange={onChangeHandler}
                               checked={t.isDone}/>
                        <EditableSpan title={t.title} onClick={changeTitle}/>
                        <button onClick={onClickHandler}>x</button>
                    </li>
                })
            }
        </ul>
        <div>
            <button className={props.filter === 'all' ? "active-filter" : ""}
                    onClick={onAllClickHandler}>All
            </button>
            <button className={props.filter === 'active' ? "active-filter" : ""}
                    onClick={onActiveClickHandler}>Active
            </button>
            <button className={props.filter === 'completed' ? "active-filter" : ""}
                    onClick={onCompletedClickHandler}>Completed
            </button>
        </div>
    </div>
}
