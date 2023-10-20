import React, {ChangeEvent, useState} from 'react';
type PropsType = {
    title: string
    onClick: (title: string) => void
}
 const EditableSpan = (props: PropsType) => {
    const [edit, setEdit] = useState(false)
    const [newTitle, setTitle] = useState(props.title)
    const editHandler = () => {
        setEdit(!edit)
        if (edit) {
            addTask()
        }
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    const addTask = () => {
        props.onClick(newTitle)
    }
    return (
        edit ?
            <input value={newTitle}
                   onChange={onChangeHandler}
                   onBlur={editHandler}
                   autoFocus
            />
            :
            <span onDoubleClick={editHandler}>{props.title}</span>
    );
};
export default  EditableSpan

