import BookModel from "./BookModel";

class ShelfCurrentLoan{
    book:BookModel;
    daysleft:number;

    constructor(book:BookModel,daysleft:number){
        this.book= book;
        this.daysleft= daysleft;
    }
}
export default ShelfCurrentLoan;