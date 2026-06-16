import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import styles from "./RdReg.module.css";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponseHandler } from 'rdjs-wheel';
import { AnyAction, Store } from 'redux';
import UserService from '@/service/user/UserService';
import { useTranslation } from "react-i18next";

interface IRegProp {
    appId: string;
    store: Store<any, AnyAction>;
    regUrl: string;
}

const RdReg: React.FC<IRegProp> = (props: IRegProp) => {
    const { t } = useTranslation();

    const fpPromise = FingerprintJS.load();
    const phoneInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const passwordReinputRef = useRef(null);
    const navigate = useNavigate();

    const handlePhoneReg = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!phoneInputRef.current || (phoneInputRef.current as HTMLInputElement).value.length === 0) {
            debugger
            toast(t("please_enter_username"));
            return;
        }
        if (!passwordInputRef.current || (passwordInputRef.current as HTMLInputElement).value.length === 0) {
            toast(t("please_enter_password"));
            return;
        }
        let pwd = (passwordInputRef.current as HTMLInputElement).value;
        let reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[`~!@#$%^&*()-=_+;':",./<>?])(?=\S+$).{6,32}$/;
        let pass = reg.test(pwd);
        if(!pass){
            toast(t("password_requirements"));
            return;
        }
        if (!passwordReinputRef.current || (passwordReinputRef.current as HTMLInputElement).value.length === 0) {
            toast(t("please_enter_password"));
            return;
        }
        let reinputPwd = (passwordReinputRef.current as HTMLInputElement).value;
        if(pwd != reinputPwd) {
            toast(t("password_mismatch"));
            return;
        }
        let values = {
            phone: (phoneInputRef.current as HTMLInputElement).value,
            password: pwd
        };
        ; (async () => {
            // Get the visitor identifier when you need it.
            const fp = await fpPromise
            const result = await fp.get()
            let params = {
                ...values,
                deviceId: result.visitorId,
                deviceName: result.visitorId,
                deviceType: 4,
                appId: props.appId,
                loginType: 1
            };
            UserService.userReg(params, props.store, props.regUrl).then((res: any) => {
                if (ResponseHandler.responseSuccess(res)) {
                    toast.success(t("register_success"));
                    navigate("/user/login");
                } else {
                    toast.error(res.msg);
                }
            });
        })();
    }

    return (
        <div className={styles.regContainer}>
            <div className={styles.regForm}>
                <form method="post" className={styles.loginElement} onSubmit={(e) => handlePhoneReg(e)}>
                    <h5>{t("register_title")}</h5>
                    <div className={styles.userName}>
                        <select id="countryCode" className={styles.countryCodeSelect}>
                            <option value="+86">+86</option>
                            <option value="+1">+1</option>
                        </select>
                        <input type="text" ref={phoneInputRef} id="phone" placeholder={t("placeholder_phone")} />
                    </div>
                    <div className={styles.password}>
                        <input type="password" ref={passwordInputRef} placeholder={t("placeholder_password")} name="p"></input>
                    </div>
                    <div className={styles.password}>
                        <input type="password" ref={passwordReinputRef} placeholder={t("placeholder_password_confirm")} name="p"></input>
                    </div>
                    <div className={styles.operate}>
                        <button className={styles.loginButton} type="submit">{t("register_submit")}</button>
                        <a href="/user/login">{t("already_have_account")}</a>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default RdReg;