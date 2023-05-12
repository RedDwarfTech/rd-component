import paySuccessIcon from "../../../assets/icons/pay/pay-success.png";
import "./PaySuccess.css";

const PaySuccess: React.FC = () => {
    return (
        <div className="pay-success-body">
            <div className="pay-success-indicator">
                <img src={paySuccessIcon}></img>
            </div>
            <div className="pay-success-tip">支付成功</div>
        </div>
    );
}

export default PaySuccess;