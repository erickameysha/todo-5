import React, {memo, useCallback} from 'react'
// import {FilterValuesType} from "./App";
import EditableSpan from "./EditableSpan";
import AddItemForm from "./AddItemForm";
import Button from "./Button";
import Task from "./Task";
import {FilterValuesType} from "./store/todolists-reducer";
import {TaskStatuses, TaskType} from "./store/todolistApi";


type PropsType = {
    todolistID: string
    title: string
    tasks: Array<TaskType>
    removeTask: (todolistId: string, taskId: string) => void
    changeFilter: (todolistId: string, value: FilterValuesType) => void
    addTask: (todolistId: string, title: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, status: TaskStatuses) => void
    removeTodolist: (todolistId: string) => void
    changeTaskTitle: (todolistID: string, newTitle: string, taskId: string) => void
    changeTodolistTitle: (todolistID: string, newTitle: string) => void
    filter: FilterValuesType
}
export const Todolist = memo((props: PropsType) => {
    const removeTodolist = useCallback(() => {
        props.removeTodolist(props.todolistID)
    },[props.removeTask, props.todolistID])
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
        tasks = tasks.filter(t => t.status == TaskStatuses.New);
    }
    if (props.filter === "completed") {
        tasks = tasks.filter(t => t.status === TaskStatuses.Completed);
    }
    const removeTask = useCallback((title: string) => props.removeTask(props.todolistID, title), [props.todolistID,props.removeTask])
    const changeTaskStatus = useCallback((taskId: string, newValue: TaskStatuses) => {
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
