import {AppRootStateType} from "./store";

export const appSelector=(state:AppRootStateType) => state.app
export const authSelector=(state:AppRootStateType) => state.auth
export const todoSelector=(state:AppRootStateType) => state.todolists
export const taskSelector=(state:AppRootStateType) => state.tasks