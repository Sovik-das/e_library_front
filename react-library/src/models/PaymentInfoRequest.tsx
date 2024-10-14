class PaymentInfoRequest{
    amount:number;
    currency:string;
    receiptEmail:any;
    constructor(amount:number,currency:string,receiptEmail:any){
        this.amount=amount;
        this.currency=currency;
        this.receiptEmail=receiptEmail;
    }
}
export default PaymentInfoRequest;