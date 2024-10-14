class ReviewModel{
    id:number;
    userEmail:string;
    date:string;
    rating:number;
    description:string;
    book_Id:number;

    constructor(Id:number,userEmail:string,date:string,rating:number,description:string,bookId:number){
        this.id=Id;
        this.userEmail=userEmail;
        this.date=date;
        this.description=description;
        this.rating=rating;
        this.book_Id=bookId;
    }
}
export default ReviewModel;