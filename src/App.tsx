import React, {useEffect, useState} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistsType = {
    id: string,
    title: string,
    filter: FilterValuesType
}

function App() {

    // let [todolist, setTodolist] = useState<TodolistsType[]>([
    //     {id: v1(), title: 'what to learn ', filter: 'completed'},
    //     {id: v1(), title: 'what to do ', filter: 'all'},
    // ])
    // useEffect(() => {
    //     console.log(todolist)
    // }, [todolist])
    // let [tasks, setTasks] = useState([
    //     {id: v1(), title: "HTML&CSS", isDone: true},
    //     {id: v1(), title: "JS", isDone: true},
    //     {id: v1(), title: "ReactJS", isDone: false},
    //     {id: v1(), title: "Rest API", isDone: false},
    //     {id: v1(), title: "GraphQL", isDone: false},
    // ]);
    let todolistID1 = v1()
    let todolistID2 = v1()

    let [todolists, setTodolists] = useState<Array<TodolistsType>>([
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ])

    let [tasks, setTasks] = useState({
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

    let [filter, setFilter] = useState<FilterValuesType>("all");


    function removeTask(todolistId: string, taskId: string) {
        // let filteredTasks = tasks.filter(t => t.id != id);
        // setTasks(filteredTasks);
        setTasks({...tasks, [todolistId]: tasks[todolistId].filter(el => el.id !== taskId)})
    }

    function addTask(todolistId: string, title: string) {
        let task = {id: v1(), title: title, isDone: false};
        // let newTasks = [task, ...tasks];
        // setTasks(newTasks);
        setTasks({...tasks, [todolistId]:[task,...tasks[todolistId] ]})
    }

    function changeStatus(todolistId:string,taskId: string, isDone: boolean) {
        // let task = tasks.find(t => t.id === taskId);
        // if (task) {
        //     task.isDone = isDone;
        // }

        setTasks({...tasks, [todolistId]: tasks[todolistId].map(el=> el.id ===taskId? {...el,isDone }:el)});
    }

    function changeFilter(todolistID: string, value: FilterValuesType) {
        // setFilter();
        // setTodolist([...todolist, todolist.map(el=> el.id ===todoli)])
        // todolist.filter(el => el.filter === value)
        setTodolists(todolists.map(el => el.id === todolistID ? {...el, filter: value} : el))
    }
    const removeTodolist = (todolistId: string) => {
setTodolists(todolists.filter(el => el.id !== todolistId))
    }
    useEffect(()=> {
        console.log(todolists)
    },[todolists])


    return (
        <div className="App">
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
                    filter={el.filter}
                />
            })}

        </div>
    );
}

export default App;