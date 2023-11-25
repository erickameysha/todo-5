import React, {memo, useCallback} from 'react';
import  './App.css'
import {FilterValuesType} from "./App";

type  propsType ={
    filter:string
    title: string
    onClick:()=> void
}
const Button = memo( (props: propsType) => {
    const buttonClick =  useCallback(() => {
      props.onClick()
    },[props.onClick])
    return (
        <button className={props.filter}
                onClick={buttonClick}>{props.title}
        </button>
    );
});

export default Button;