export class PayToken {
    readonly uidAccount: string;
    readonly prefixReferenceCode: string;
    readonly description: string;
    readonly txValue: number;
    readonly personInfo: PersonInfo;
    readonly creditCardTokenId: string;
    readonly paymentMethod: 'MASTERCARD' | 'VISA' | 'CODENSA' | 'AMEX';
    readonly deviceSessionId: string;
    readonly cookie: string;

}

export class PersonInfo {
    readonly id: string;
    readonly fullName: string;
    readonly emailAddress: string;
    readonly address: string;
    readonly phone: string;
    readonly country?: string;

}