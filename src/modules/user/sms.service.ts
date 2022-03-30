import { Injectable } from '@nestjs/common';
import { tengxunyunApiDecode } from '../../utils/utils';
import { ConfigService } from '@nestjs/config';
const tencentcloud = require("tencentcloud-sdk-nodejs");
const smsClient = tencentcloud.sms.v20210111.Client;

@Injectable()
export class SmsService {
    constructor(
        private configService: ConfigService,
    ) { }

    /**
     * 发送验证码给前端
     * @param phone 目标手机号
     * @param verificationCode  需要发送的验证码
     */
    async sendVerificationCode(phone: string, verificationCode: string): Promise<boolean> {
        /* 实例化要请求产品(以sms为例)的client对象 */
        const client = new smsClient({
            credential: {
                /* 必填：腾讯云账户密钥对secretId，secretKey。
                 * 这里采用的是从环境变量读取的方式，需要在环境变量中先设置这两个值。
                 * 你也可以直接在代码中写死密钥对，但是小心不要将代码复制、上传或者分享给他人，
                 * 以免泄露密钥对危及你的财产安全。 */
                secretId: tengxunyunApiDecode(this.configService.get('secretId')),
                secretKey: tengxunyunApiDecode(this.configService.get('secretKey')),
            },
            /* 必填：地域信息，可以直接填写字符串ap-guangzhou，支持的地域列表参考 https://cloud.tencent.com/document/api/382/52071#.E5.9C.B0.E5.9F.9F.E5.88.97.E8.A1.A8 */
            region: "ap-guangzhou",
            /* 非必填:
             * 客户端配置对象，可以指定超时时间等配置 */
            profile: {
                /* SDK默认用TC3-HMAC-SHA256进行签名，非必要请不要修改这个字段 */
                signMethod: "HmacSHA256",
                httpProfile: {
                    /* SDK默认使用POST方法。
                     * 如果你一定要使用GET方法，可以在这里设置。GET方法无法处理一些较大的请求 */
                    reqMethod: "POST",
                    /* SDK有默认的超时时间，非必要请不要进行调整
                     * 如有需要请在代码中查阅以获取最新的默认值 */
                    reqTimeout: 30,
                    /**
                     * SDK会自动指定域名。通常是不需要特地指定域名的，但是如果你访问的是金融区的服务
                     * 则必须手动指定域名，例如sms的上海金融区域名： sms.ap-shanghai-fsi.tencentcloudapi.com
                     */
                    endpoint: "sms.tencentcloudapi.com"
                },
            },
        })

        /* 请求参数，根据调用的接口和实际情况，可以进一步设置请求参数
         * 属性可能是基本类型，也可能引用了另一个数据结构
         * 推荐使用IDE进行开发，可以方便的跳转查阅各个接口和数据结构的文档说明 */
        const params = {
            /* 短信应用ID: 短信SmsSdkAppId在 [短信控制台] 添加应用后生成的实际SmsSdkAppId，示例如1400006666 */
            SmsSdkAppId: "1400633837",
            /* 短信签名内容: 使用 UTF-8 编码，必须填写已审核通过的签名，签名信息可登录 [短信控制台] 查看 */
            SignName: "陈晓飞学些Linux",
            /* 短信码号扩展号: 默认未开通，如需开通请联系 [sms helper] */
            ExtendCode: "",
            /* 国际/港澳台短信 senderid: 国内短信填空，默认未开通，如需开通请联系 [sms helper] */
            SenderId: "",
            /* 用户的 session 内容: 可以携带用户侧 ID 等上下文信息，server 会原样返回 */
            SessionContext: "",
            /* 下发手机号码，采用 e.164 标准，+[国家或地区码][手机号]
             * 示例如：+8613711112222， 其中前面有一个+号 ，86为国家码，13711112222为手机号，最多不要超过200个手机号*/
            PhoneNumberSet: [`+86${phone}`],
            /* 模板 ID: 必须填写已审核通过的模板 ID。模板ID可登录 [短信控制台] 查看 */
            TemplateId: "1305190",
            /* 模板参数: 若无模板参数，则设置为空*/
            TemplateParamSet: [verificationCode, '5'],
        }
        return new Promise(async (resolve, reject) => {
            const result = await client.SendSms(params);
            if (result && result?.SendStatusSet[0].Code === 'Ok') {
                resolve(true);
            } else {
                reject(false)
            }
        });
    }
}
