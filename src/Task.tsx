import React, {ChangeEvent, memo, useCallback} from 'react';
import EditableSpan from "./EditableSpan";
import {TaskType} from "./AppWithRedux";

type  TaskPropsType = {
    task: TaskType
    removeTask: ( taskId: string) => void
    changeTaskStatus: ( taskId: string, isDone: boolean) => void
    // onChangeTaskTitle : (title: string, taskID: string) => void
    changeTaskTitle: ( newTitle: string, taskId: string) => void

}
const Task = memo(({task,changeTaskTitle,changeTaskStatus,removeTask}: TaskPropsType) => {
    const onClickHandler = useCallback(() => removeTask(task.id),[removeTask])
    const onChangeHandler = useCallback( (e: ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus( task.id, e.currentTarget.checked);
    },[changeTaskStatus])
    const changeTitle = useCallback((title: string) => {
        changeTaskTitle(title,task.id)
    },[changeTaskTitle])
    return (
        <li style={{display: 'flex', paddingBottom: '5px'}}
            className={task.isDone ? "is-done" : ""}>
            <input type="checkbox"
                   onChange={onChangeHandler}
                   checked={task.isDone}/>
            <EditableSpan title={task.title} onClick={changeTitle}/>
            <button onClick={onClickHandler}>x</button>
        </li>
    );
});

export default Task;