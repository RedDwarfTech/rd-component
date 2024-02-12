import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import styles from "./RdReg.module.css";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponseHandler } from 'rdjs-wheel';
import { AnyAction, Store } from 'redux';
import UserService from '@/service/user/UserService';

interface IRegProp {
    appId: string;
    store: Store<any, AnyAction>;
    regUrl: string;
}

const RdReg: React.FC<IRegProp> = (props: IRegProp) => {

    const fpPromise = FingerprintJS.load();
    const phoneInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const passwordReinputRef = useRef(null);
    const navigate = useNavigate();

    const handlePhoneReg = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!phoneInputRef.current || (phoneInputRef.current as HTMLInputElement).value.length === 0) {
            debugger
            toast("请输入用户名!");
            return;
        }
        if (!passwordInputRef.current || (passwordInputRef.current as HTMLInputElement).value.length === 0) {
            toast("请输入密码!");
            return;
        }
        if (!passwordReinputRef.current || (passwordReinputRef.current as HTMLInputElement).value.length === 0) {
            toast("请输入密码!");
            return;
        }
        let pwd = (passwordInputRef.current as HTMLInputElement).value;
        let reinputPwd = (passwordReinputRef.current as HTMLInputElement).value;
        if(pwd != reinputPwd) {
            toast("输入密码不一致!");
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
                    toast.success("注册成功");
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
                    <h5>注册</h5>
                    <div className={styles.userName}>
                        <select id="countryCode" className={styles.countryCodeSelect}>
                            <option value="+86">+86</option>
                            <option value="+1">+1</option>
                        </select>
                        <input type="text" ref={phoneInputRef} id="phone" placeholder="请输入手机号码" />
                    </div>
                    <div className={styles.password}>
                        <input type="password" ref={passwordInputRef} placeholder="密码" name="p"></input>
                    </div>
                    <div className={styles.password}>
                        <input type="password" ref={passwordReinputRef} placeholder="再次输入密码" name="p"></input>
                    </div>
                    <div className={styles.operate}>
                        <button className={styles.loginButton} type="submit">注册</button>
                        <a href="/user/login">已经有账号，去登录</a>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default RdReg;