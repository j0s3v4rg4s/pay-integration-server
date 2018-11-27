import { HttpService, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateToken, PayToken, PayuAccount, PingData } from '../../models';
import { ConfigService } from '../../../config/config.service';
import { map } from 'rxjs/operators';
import * as md5 from 'md5';

@Injectable()
export class PayService {
    // ***************************************************************************
    // Constructor
    // ***************************************************************************

    constructor(private readonly http: HttpService, private config: ConfigService) {}

    // ***************************************************************************
    // Public Methods
    // ***************************************************************************
    async ping(data: PingData) {
        const account = await PayService.getAccountInfo(data.userUid);
        return this.callPayu(
            `${this.config.get('PAYU_ENDPOINT')}/reports-api/4.0/service.cgi`,
            {
                command: 'PING',
            },
            account,
        );
    }

    async createToken(data: CreateToken) {
        const account = await PayService.getAccountInfo(data.uidAccount);
        const obj = {
            command: 'CREATE_TOKEN',
            creditCardToken: {
                payerId: data.payerId,
                name: data.name,
                paymentMethod: data.paymentMethod,
                number: data.number,
                expirationDate: data.expirationDate,
            },
        };
        const url = `${this.config.get('PAYU_ENDPOINT')}/payments-api/4.0/service.cgi `;
        return this.callPayu(url, obj, account);
    }

    async payWithToken(data: PayToken, ipAddress: string, userAgent: string) {
        const account = await PayService.getAccountInfo(data.uidAccount);
        const code = `${data.prefixReferenceCode}-${Date.now()}`;
        const signature = md5(`${account.apiKey}~${account.merchantId}~${code}~${data.txValue}~${account.currency}`);
        const url = `${this.config.get('PAYU_ENDPOINT')}/payments-api/4.0/service.cgi `;
        const body = {
            command: 'SUBMIT_TRANSACTION',
            transaction: {
                order: {
                    accountId: account.accountId,
                    referenceCode: code,
                    description: data.description,
                    language: 'en',
                    signature,
                    notifyUrl: `${this.config.get('URL_SERVER')}/payu/query/web-hook`,
                    additionalValues: {
                        TX_VALUE: {
                            value: data.txValue,
                            currency: account.currency,
                        },
                    },
                    buyer: {
                        merchantBuyerId: data.personInfo.id,
                        fullName: data.personInfo.fullName,
                        emailAddress: data.personInfo.emailAddress,
                        shippingAddress: {
                            street1: data.personInfo.address,
                            country: data.personInfo.country || account.country,
                            phone: data.personInfo.phone,
                        },
                    },
                    shippingAddress: {
                        street1: data.personInfo.address,
                        country: data.personInfo.country || account.country,
                        phone: data.personInfo.phone,
                    },
                },
                payer: {
                    merchantPayerId: data.personInfo.id,
                    fullName: data.personInfo.fullName,
                    emailAddress: data.personInfo.emailAddress,
                    billingAddress: {
                        street1: data.personInfo.address,
                        country: data.personInfo.country || account.country,
                        phone: data.personInfo.phone,
                    },
                },
                creditCardTokenId: data.creditCardTokenId,
                extraParameters: {
                    INSTALLMENTS_NUMBER: 1,
                },
                type: 'AUTHORIZATION_AND_CAPTURE',
                paymentMethod: data.paymentMethod,
                paymentCountry: account.country,
                deviceSessionId: data.deviceSessionId,
                ipAddress,
                cookie: data.cookie,
                userAgent,
            },
        };
        return this.callPayu(url, body, account);
    }

    // ***************************************************************************
    // Private methods
    // ***************************************************************************
    private static async getAccountInfo(keyAccount: string) {
        const snap = await admin
            .firestore()
            .collection('payu')
            .doc(keyAccount)
            .get();
        return snap.data() as PayuAccount;
    }

    private callPayu(uri: string, data: any, account: PayuAccount) {
        return this.http
            .post(uri, {
                test: false,
                language: 'en',
                merchant: {
                    apiLogin: account.apiLogin,
                    apiKey: account.apiKey,
                },
                ...data,
            })
            .pipe(map(respond => respond.data));
    }
}
