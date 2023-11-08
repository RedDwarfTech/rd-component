import paySuccessIcon from "../../../assets/icons/pay/pay-success.png";
import styles from "./PaySuccess.module.css";

const PaySuccess: React.FC = () => {
    return (
        <div className={styles.paySuccessBody}>
            <div className={styles.paySuccessIndicator}>
                <img src={paySuccessIcon}></img>
            </div>
            <div className={styles.paySuccessTip}>支付成功</div>
        </div>
    );
}

export default PaySuccess;