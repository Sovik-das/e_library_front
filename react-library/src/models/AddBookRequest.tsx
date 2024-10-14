class AddBookRequest {
    title:string;
    description:string;
    copies:number;
    author:string;
    img:string;
    category:string;

    constructor(title:string,copies:number,description:string,img:string,category:string,author:string){
        this.title=title;
        this.description=description;
        this.author=author;
        this.img=img;
        this.copies=copies;
        this.category=category;
    }
}
export default AddBookRequest;