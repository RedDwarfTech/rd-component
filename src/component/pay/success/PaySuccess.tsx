import paySuccessIcon from "../../../assets/icons/pay/pay-success.png";
import "./PaySuccess.css";
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import UserService from "@/service/user/UserService";
import { RequestHandler, ResponseHandler } from "js-wheel";

export type PaySuccessProps = {
    refreshUser: boolean;
};

const PaySuccess: React.FC<PaySuccessProps> = (props: PaySuccessProps) => {

    const location = useLocation();
    if (location.search == null) {
        return (<div className="pay-success-body">
            <h1>支付失败！</h1>
        </div>);
    }
    // 回调的链接可能是这样的格式https://read.poemhub.top/product/pay/success?orderId=619464963527516160&amp;payAmount=0.01&amp;sign_type=RSA2&amp;timestamp=2023-03-09%2002:21:56&amp;version=1.0
    // &amp;是为了兼容老旧的浏览器
    // 现代浏览器已经不再需要将 & 编码为 &amp;，但一些较旧版本的浏览器和遗留系统可能仍然需要这样做。
    const parsed = queryString.parse(location.search.replace(/&amp;/g, '&'));
    if (parsed != null && parsed.orderId && parsed.payAmount) {
        if (props && props.refreshUser) {
            UserService.getCurrUser().then((data: any) => {
                if (ResponseHandler.responseSuccess(data)) {
                    localStorage.setItem("userInfo", JSON.stringify(data.result));
                    RequestHandler.handleWebAccessTokenExpire();
                }
            });
        }
        return (
            <div className="pay-success-body">
                <div className="pay-success-indicator">
                    <img src={paySuccessIcon}></img>
                </div>
                <div className="pay-success-tip">支付成功</div>
            </div>
        );
    } else {
        return (<div className="pay-success-body">
            <h1>支付失败！</h1>
        </div>);
    }
}

export default PaySuccess;