import { UserModel, TimeUtils } from "rdjs-wheel";

export const UserProfile = {
    getVipExpiredTime: (userInfo?: UserModel): string => {
        if (!userInfo || !userInfo.autoRenewProductExpireTimeMs) {
            return "--";
        }
        const expiredTime = Number(userInfo.autoRenewProductExpireTimeMs);
        if (expiredTime && expiredTime > new Date().getTime()) {
            return TimeUtils.getFormattedTime(expiredTime);
        } else {
            return "--";
        }
    }
}

export default UserProfile