class AdminMessageRequest {
    id:number;
    response:string;

    constructor(id:number,resp:string){
        this.id=id;
        this.response=resp;
    }
}

export default AdminMessageRequest;