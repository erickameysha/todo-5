import React, {ChangeEvent, memo, useCallback} from 'react'
import {FilterValuesType} from "./App";
import EditableSpan from "./EditableSpan";
import AddItemForm from "./AddItemForm";
import Button from "./Button";
import Task from "./Task";

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
    changeTaskStatus: (todolistId: string, taskId: string, isDone: boolean) => void
    removeTodolist: (todolistId: string) => void
    changeTaskTitle: (todolistID: string, newTitle: string, taskId: string) => void
    changeTodolistTitle: (todolistID: string, newTitle: string) => void
    filter: FilterValuesType
}
export const Todolist = memo((props: PropsType) => {
    console.log('Todolist')
    const removeTodolist = () => {
        props.removeTodolist(props.todolistID)
    }
    const onAllClickHandler = useCallback(() => props.changeFilter(props.todolistID, "all"), [props.changeFilter, props.todolistID]);
    const onActiveClickHandler = useCallback(() => props.changeFilter(props.todolistID, "active"), [props.changeFilter, props.todolistID]);
    const onCompletedClickHandler = useCallback(() => props.changeFilter(props.todolistID, "completed"), [props.changeFilter, props.todolistID]);

    const addTask = useCallback((title: string) => {
        props.addTask(props.todolistID, title)
    }, [props.addTask, props.todolistID])
    const onChangeTaskTitle = useCallback((title: string, taskID: string) => {
        props.changeTaskTitle(props.todolistID, title, taskID)
    },[props.changeTaskTitle,props.todolistID])
    const onChangeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.todolistID, title)
    }, [props.changeTodolistTitle, props.todolistID])

    let tasks = props.tasks

    if (props.filter === "active") {
        tasks = tasks.filter(t => !t.isDone);
    }
    if (props.filter === "completed") {
        tasks = tasks.filter(t => t.isDone);
    }
    const removeTask = useCallback((title: string) => props.removeTask(props.todolistID, title), [props.todolistID,props.removeTask])
    const changeTaskStatus = useCallback((taskId: string, newValue: boolean) => {
        props.changeTaskStatus(props.todolistID, taskId, newValue);
    }, [props.todolistID, props.changeTaskStatus])

    return <div>
        <h3>
            <EditableSpan title={props.title} onClick={onChangeTodolistTitle}/>
            <button onClick={removeTodolist}>x</button>
        </h3>
        <div>
            <AddItemForm callback={addTask}/>
        </div>
        <ul>
            {
                tasks.map(t => {
                    return <Task key={t.id}
                                 task={t}
                                 changeTaskStatus={changeTaskStatus}
                                 changeTaskTitle={onChangeTaskTitle}
                                 removeTask={removeTask}
                    />
                })
            }
        </ul>
        <div>

            <Button filter={props.filter === 'all' ? "active-filter" : ""} onClick={onAllClickHandler} title={'ALL'}/>
            <Button filter={props.filter === 'active' ? "active-filter" : ""} onClick={onActiveClickHandler}
                    title={'Active'}/>
            <Button filter={props.filter === 'completed' ? "active-filter" : ""} onClick={onCompletedClickHandler}
                    title={'Completed'}/>
        </div>
    </div>
})
