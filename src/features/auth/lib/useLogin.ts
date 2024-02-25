import {FormikHelpers, useFormik} from "formik";
import {authThunks} from "features/auth/model/auth.slice";
import {BaseResponseType} from "common/types";
import {useAppDispatch, useAppSelector} from "app/store";
import {authSelector} from "features/auth/model/auth.selectors";
import {LoginParamsType} from "features/auth/ui/login";

type FormikErrorType =  Partial<Omit<LoginParamsType, "captcha">>


export const useLogin = () => {
    const dispatch = useAppDispatch()

    const {isLoggedIn} = useAppSelector(authSelector)
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {
            const errors: FormikErrorType = {}
            if (!values.email) {
                errors.email = 'Required';
            } else if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$n/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }

            if (!values.password) {
                errors.password = 'Required'
            } else if (values.password.length < 5) {
                errors.password = 'Must be more five symbols'
            }

            return errors
        },
        onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
            dispatch(authThunks.login({data: values}))
                .unwrap()
                .catch((e: BaseResponseType) => {
                    if (e.fieldsErrors) {
                        e.fieldsErrors.forEach(el => {
                            formikHelpers.setFieldError(el.field, el.error)
                        })
                    }
                })
        },
    })
    return {formik,isLoggedIn}
}