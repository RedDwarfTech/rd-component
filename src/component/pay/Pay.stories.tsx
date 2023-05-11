import type { Meta, StoryObj } from '@storybook/react';
import Pay from './Pay';

const meta: Meta<typeof Pay> = {
  title: 'Pay',
  component: Pay,
};

export default meta;

type Story = StoryObj<typeof Pay>;

const formText ="<form name=\"punchout_form\" method=\"post\" action=\"https://openapi.alipay.com/gateway.do?charset=UTF-8&method=alipay.trade.page.pay&sign=aCuDCa6DZfc62OnVyyHsXEE7xGoBl%2FA%2Fh448tK1fqTf1WbPF6vvGYcbUmnw3gxR4PRBP2Di2aErwUTMOqMblnlXRRRDbQt%2F16WdJ15uHHWqj6X7vmyEQO8mZClVaXD2vCc1Pm9R5FiKhMPC7TbIM3HkdvKmPZm4hSrolscEal5rA%2Fi6AU8y1Vyy%2FLnmUabeaySzO%2FvZK3yEv1UonpLknY7wx49QMkPZUGZZtQgnU4cWzWYQvZIcXcFRIE9jvrq%2BqIrxrnQ78S1DP8m%2Fkx7rBGUjZp4fkruN%2FMM8BRHTMrgcKwhO27zvH1C9BChn3qQa8qu2gMD9onJ%2BvXrJxo%2BfIEQ%3D%3D&return_url=https%3A%2F%2Fzj.poemhub.top%2Fproduct%2Fpay%2Fsuccess%3ForderId%3D642534241616220160%26payAmount%3D2.00&notify_url=https%3A%2F%2Fread.poemhub.top%2Fpost%2Falipay%2Fnotification%2Fv1%2FalipaySeverNotification&version=1.0&app_id=2021003191605707&sign_type=RSA2&timestamp=2023-05-11+18%3A11%3A00&alipay_sdk=alipay-sdk-java-4.35.65.ALL&format=json\">\n<input type=\"hidden\" name=\"biz_content\" value=\"{&quot;out_trade_no&quot;:&quot;642534241616220160&quot;,&quot;product_code&quot;:&quot;FAST_INSTANT_TRADE_PAY&quot;,&quot;qr_pay_mode&quot;:&quot;4&quot;,&quot;subject&quot;:&quot;证件照下载&quot;,&quot;total_amount&quot;:&quot;2.00&quot;}\">\n<input type=\"submit\" value=\"立即支付\" style=\"display:none\" >\n</form>\n<script>document.forms[0].submit();</script>"
;

export const Primary: Story = {
  render: () => <Pay payFormText={formText} price={'2.00'} payProvider={'支付宝'} onPayComplete={function (): void {
    throw new Error('Function not implemented.');
  } } />,
};