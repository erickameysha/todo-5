
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string,
    isInitialized: null as null| boolean
}
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppIsInitializedACType = ReturnType<typeof setAppIsInitializedAC>

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case "APP/SET-IS-INITIALIZED":
            return {...state,isInitialized: action.isInitialized}
        default:
            return state
    }
}
export const setAppStatusAC = (status: RequestStatusType) => ({
    type: 'APP/SET-STATUS', status
} as const)
export const setAppErrorAC = (error: string| null) => ({
    type: 'APP/SET-ERROR', error
} as const)
export const setAppIsInitializedAC = (isInitialized: boolean) => ({
    type: 'APP/SET-IS-INITIALIZED', isInitialized
} as const)
export type ActionsType =
    SetAppStatusActionType
    | SetAppErrorActionType
    |SetAppIsInitializedACType