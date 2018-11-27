export class CreateToken {
    readonly uidAccount: string;
    readonly payerId: string;
    readonly name: string;
    readonly paymentMethod: 'MASTERCARD' | 'VISA' | 'CODENSA' | 'AMEX';
    readonly number: string;
    readonly expirationDate: string;
}
