import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import styles from "./RdReg.module.css";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useEffect, useRef, useState } from 'react';
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

const SMS_REG_REMAIN_KEY = "sms-reg-remain-seconds";
const REG_SEND_VERIFY_URL = "/infra/user/reg/send-verify-code";

const RdReg: React.FC<IRegProp> = (props: IRegProp) => {
    const { t } = useTranslation();

    const fpPromise = FingerprintJS.load();
    const phoneInputRef = useRef(null);
    const codeInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const passwordReinputRef = useRef(null);
    const navigate = useNavigate();
    const [showCountDown, setShowCountDown] = useState(false);
    const [remainSeconds, setRemainSeconds] = useState(0);

    useEffect(() => {
        if (!showCountDown || remainSeconds <= 0) {
            return;
        }
        const timer = setInterval(() => {
            setRemainSeconds((prev) => {
                const next = prev - 1;
                if (next <= 0) {
                    localStorage.removeItem(SMS_REG_REMAIN_KEY);
                    setShowCountDown(false);
                    return 0;
                }
                localStorage.setItem(
                    SMS_REG_REMAIN_KEY,
                    JSON.stringify({
                        createdTime: Date.now(),
                        remainSeconds: next,
                    })
                );
                return next;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [showCountDown]);

    useEffect(() => {
        const remain = localStorage.getItem(SMS_REG_REMAIN_KEY);
        if (!remain) {
            return;
        }
        try {
            const remainObj = JSON.parse(remain);
            if (remainObj.createdTime < Date.now() - 60000) {
                localStorage.removeItem(SMS_REG_REMAIN_KEY);
                return;
            }
            setRemainSeconds(remainObj.remainSeconds || 0);
            setShowCountDown(true);
        } catch {
            localStorage.removeItem(SMS_REG_REMAIN_KEY);
        }
    }, []);

    const sendVerifyCode = () => {
        if (!phoneInputRef.current || (phoneInputRef.current as HTMLInputElement).value.length === 0) {
            toast(t("please_enter_username"));
            return;
        }
        const phone = (phoneInputRef.current as HTMLInputElement).value;
        UserService.doSendVerifyCode(
            { phone, app_id: props.appId },
            REG_SEND_VERIFY_URL,
            props.store
        ).then((res: any) => {
            if (ResponseHandler.responseSuccess(res)) {
                setRemainSeconds(60);
                setShowCountDown(true);
                localStorage.setItem(
                    SMS_REG_REMAIN_KEY,
                    JSON.stringify({
                        createdTime: Date.now(),
                        remainSeconds: 60,
                    })
                );
            } else {
                toast.error(res.msg);
            }
        });
    };

    const handlePhoneReg = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!phoneInputRef.current || (phoneInputRef.current as HTMLInputElement).value.length === 0) {
            toast(t("please_enter_username"));
            return;
        }
        if (!codeInputRef.current || (codeInputRef.current as HTMLInputElement).value.length === 0) {
            toast(t("please_enter_verify_code"));
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
            password: pwd,
            verifyCode: (codeInputRef.current as HTMLInputElement).value,
        };
        ; (async () => {
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
<<<<<<< HEAD
                <div className={styles.regTabs}>
                    <div className={styles.tablinks}>注册</div>
                </div>
                <div className={styles.tabcontent}>
                    <h5>注册</h5>
                    <form method="post" className={styles.loginElement} onSubmit={(e) => handlePhoneReg(e)}>
                    <div className={styles.phoneInputGroup}>
                        <select
                            id="countryCode"
                            className={styles.countryCodeSelect}
                            aria-label="国家区号"
                        >
                            <option value="+86">+86</option>
                            <option value="+1">+1</option>
                        </select>
                        <input
                            type="text"
                            ref={phoneInputRef}
                            id="phone"
                            className={styles.phoneInput}
                            placeholder="请输入手机号码"
                        />
=======
                <form method="post" className={styles.loginElement} onSubmit={(e) => handlePhoneReg(e)}>
                    <h5>{t("register_title")}</h5>
                    <div className={styles.userName}>
                        <select id="countryCode" className={styles.countryCodeSelect}>
                            <option value="+86">+86</option>
                            <option value="+1">+1</option>
                        </select>
                        <input type="text" ref={phoneInputRef} id="phone" placeholder={t("placeholder_phone")} />
                    </div>
                    <div className={styles.verifyCodeRow}>
                        <input
                            type="text"
                            ref={codeInputRef}
                            placeholder={t("placeholder_verify_code")}
                        />
                        {showCountDown && remainSeconds > 0 ? (
                            <span className={styles.countDownText}>
                                {t("sms_countdown", { seconds: remainSeconds })}
                            </span>
                        ) : (
                            <button
                                type="button"
                                className={styles.verifyCodeBtn}
                                onClick={sendVerifyCode}
                            >
                                {t("get_verify_code")}
                            </button>
                        )}
>>>>>>> 04175645ea90020af87b2e9021f77d17189ff84b
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
            </div>
            <ToastContainer />
        </div>
    );
}

export default RdReg;
