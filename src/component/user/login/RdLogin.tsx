import React, { useRef, useState } from "react";
import styles from "./RdLogin.module.css";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ResponseHandler } from "rdjs-wheel";
import { AnyAction, Store } from "redux";
import UserService from "@/service/user/UserService";
import Turnstile, { useTurnstile } from "react-turnstile";
import { useTranslation } from "react-i18next";

interface ILoginProp {
  appId: string;
  store: Store<any, AnyAction>;
  loginUrl: string;
  cfSiteKey: string;
  enableWechatLogin: boolean;
}

const RdLogin: React.FC<ILoginProp> = (props: ILoginProp) => {
  const { t } = useTranslation();
  const fpPromise = FingerprintJS.load();
  const [activeTab, setActiveTab] = useState<String>("");
  const [cfVerifyToken, setCfVerifyToken] = useState<String>("");
  const phoneInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const navigate = useNavigate();
  const turnstile = useTurnstile();

  React.useEffect(() => {
    setDefaultTab();
  }, []);

  const setDefaultTab = () => {
    if (!activeTab || activeTab.length === 0) {
      const element = document.getElementById("phoneTabs") as HTMLButtonElement;
      if (element) {
        element.click();
      }
    }
  };

  const openCity = (
    evt: React.MouseEvent<HTMLButtonElement>,
    cityName: string
  ): void => {
    setActiveTab(cityName);
    let i: number;
    const tabcontent = document.querySelectorAll(`.${styles.tabcontent}`);
    for (i = 0; i < tabcontent.length; i++) {
      (tabcontent[i] as HTMLElement).style.display = "none";
    }
    const tablinks = document.querySelectorAll(`.${styles.tablinks}`);
    for (i = 0; i < tablinks.length; i++) {
      (tablinks[i] as HTMLElement).className = (
        tablinks[i] as HTMLElement
      ).className.replace(" active", "");
    }
    const cityElement = document.getElementById(cityName);
    if (cityElement) {
      cityElement.style.display = "block";
    }
    (evt.currentTarget as HTMLElement).className += " active";
  };

  const handlePhoneLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !phoneInputRef.current ||
      (phoneInputRef.current as HTMLInputElement).value.length === 0
    ) {
      debugger;
      toast(t("please_enter_username"));
      return;
    }
    if (
      !passwordInputRef.current ||
      (passwordInputRef.current as HTMLInputElement).value.length === 0
    ) {
      toast(t("please_enter_password"));
      return;
    }
    let values = {
      phone: (phoneInputRef.current as HTMLInputElement).value,
      password: (passwordInputRef.current as HTMLInputElement).value,
    };
    (async () => {
      // Get the visitor identifier when you need it.
      const fp = await fpPromise;
      const result = await fp.get();
      let params = {
        ...values,
        deviceId: result.visitorId,
        deviceName: result.visitorId,
        deviceType: 4,
        appId: props.appId,
        loginType: 1,
        cfToken: cfVerifyToken
      };
      UserService.userLoginByPhoneImpl(
        params,
        props.store,
        props.loginUrl
      ).then((res) => {
        if (ResponseHandler.responseSuccess(res)) {
          navigate("/");
        } else {
          toast.error(res.msg);
        }
      });
    })();
  };

  const userAlipayQrCodeLogin = () => {
    let param = {
      appId: props.appId,
    };
    UserService.userLoginImpl(
      param,
      props.store,
      "/infra/alipay/login/getQRCodeUrl"
    ).then((data: any) => {
      window.location.href = data.result;
    });
  };

  const userWechatQrCodeLogin = () => {
    let param = {
      appId: props.appId,
    };
    UserService.userLoginImpl(
      param,
      props.store,
      "/infra/wechat/login/getQRCodeUrl"
    ).then((data: any) => {
      window.location.href = data.result;
    });
  };

  const renderWechatLogins = () => {
    if(props.enableWechatLogin){
      return (<button
        className={styles.tablinks}
        onClick={(e) => {
          userWechatQrCodeLogin();
        }}
      >
        {t("login_wechat_qr")}
      </button>);
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <div className={styles.loginTabs}>
          <button
            id="phoneTabs"
            className={styles.tablinks}
            onClick={(e) => {
              openCity(e, "phone");
            }}
          >
            {t("login_phone")}
          </button>
          {renderWechatLogins()}
          <button
            className={styles.tablinks}
            onClick={(e) => {
              userAlipayQrCodeLogin();
            }}
          >
            {t("login_alipay_qr")}
          </button>
        </div>
        <div id="phone" className={styles.tabcontent}>
          <h5>{t("login_title")}</h5>
          <form
            method="post"
            className={styles.loginElement}
            onSubmit={(e) => handlePhoneLogin(e)}
          >
            <div className={styles.userName}>
              <select id="countryCode" className={styles.countryCodeSelect}>
                <option value="+86">+86</option>
                <option value="+1">+1</option>
              </select>
              <input
                type="text"
                ref={phoneInputRef}
                id="phone"
                placeholder={t("placeholder_phone")}
              />
            </div>
            <div className={styles.password}>
              <input
                type="password"
                ref={passwordInputRef}
                placeholder={t("placeholder_password")}
                name="p"
              ></input>
            </div>
            <div>
              <Turnstile
                className={styles.turnstile}
                sitekey={props.cfSiteKey}
                onVerify={(token) => {
                  setCfVerifyToken(token);
                }}
              />
            </div>
            <div className={styles.operate}>
              <button className={styles.loginButton} type="submit">
                {t("login_submit")}
              </button>
            </div>
            <div className={styles.handleSituation}>
              <a href="/user/reg">{t("no_account_register")}</a>
              <a href="/userpage/pwd/retrieve">{t("forgot_password")}</a>
            </div>
          </form>
        </div>
        <div id="wechat" className={styles.tabcontent}></div>
        <div id="alipay" className={styles.tabcontent}></div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RdLogin;
