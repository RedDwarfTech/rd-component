import React from "react";
import "./Pay.css";

export type PayProps = {
  payFormText: string;
  price: string;
  payProvider: string;
  onPayComplete: () => void;
};

const Pay: React.FC<PayProps> = (props) => {

  const formText = props.payFormText;
  const priceText = props.price;
  const payProvider = props.payProvider;

  const displayStyle = (style: string) => {
    const payMask = document.getElementById("pay-mask");
    if (payMask) {
      payMask.style.display = style;
    }
    const payPop = document.getElementById("pay-popup");
    if (payPop) {
      payPop.style.display = style;
    }
  }

  if (formText && formText.length > 0) {
    displayStyle('block');
  } else {
    displayStyle('none');
  }

  return (
    <div>
      <div id="pay-mask" className="pay-mask"></div>
      <div id="pay-popup" className="pay-pop">
        <div className="pay-container" id="main">
          <div className="pay-money">支付金额&nbsp;&nbsp;<span id="pay_price">{priceText}元</span></div>
          <div>
            <div className="pay-img">
              <iframe srcDoc={formText}
                width="200"
                height="200"
              >
              </iframe>
            </div>
          </div>
          <p className="pay-paragraph">
            <img className="pay-scan"
              src="/addons/zzzy_idcard_pc/core/web/statics/images/site/icon-wechat.png"
              alt="" />{payProvider}扫码支付
          </p>
          <button className="pay-complete-btn" onClick={props.onPayComplete}>支付完成</button>
        </div>
      </div>
    </div>
  );
}

export default Pay;