class HistoryModel{
    id:number;
    userEmail:string;
    title:string;
    author:string;
    description:string;
    image:string;
    checkoutDate:string;
    returnDate:string;

    constructor(id:number,email:string,title:string,description:string,img:string,checkoutDate:string,
        returnDate:string,author:string){
            this.id=id;
            this.userEmail=email;
            this.title=title;
            this.description=description;
            this.checkoutDate=checkoutDate;
            this.returnDate=returnDate;
            this.author=author;
            this.image=img;
        }
}
export default HistoryModel;