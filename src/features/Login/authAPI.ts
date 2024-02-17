import {AxiosResponse} from "axios";

import {instance} from "../../common/api";
import {BaseResponseType} from "../../common/types";

export const authAPI = {
    login(data: LoginDataType) {
        return instance.post<BaseResponseType<{ userId: number }>, AxiosResponse<BaseResponseType<{
            userId: number
        }>>, LoginDataType>('auth/login', data);
    },
    logOut()  {
        return instance.delete<BaseResponseType>('auth/login');
    },
    me() {
        return instance.get<BaseResponseType<UserDataType>>('auth/me');

    }
}
export type LoginDataType = {
    email: string,
    password: string,
    rememberMe: boolean
}
type UserDataType = {
    id: number,
    email: string,
    login: string
}