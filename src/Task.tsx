import React, {ChangeEvent, memo} from 'react';
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
    console.log('task' )
    const onClickHandler = () => removeTask( task.id)
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus( task.id, e.currentTarget.checked);
    }
    const changeTitle =(title: string) => {
        debugger
        changeTaskTitle(title,task.id)
    }
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