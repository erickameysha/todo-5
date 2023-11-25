import React, {ChangeEvent, KeyboardEvent, memo, useCallback, useState} from 'react';

type PropsType = {
    callback: (title: string) => void


}
const AddItemForm = memo((props: PropsType) => {
    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const addTask = useCallback( () => {

        if (title.trim() !== "") {
            props.callback(title.trim())
            // props.addTask(props.todolistID,title.trim());
            setTitle("");
        } else {
            setError("Title is required");
        }
    },[props.callback, title])

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if(error)  setError(null);
        if (e.charCode === 13) {
            addTask();
        }
    }

    return (
        <div>
            <input value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   className={error ? "error" : ""}

            />
            <button onClick={addTask}>+</button>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
});

export default AddItemForm;