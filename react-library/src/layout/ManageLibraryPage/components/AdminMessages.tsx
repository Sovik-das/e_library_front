import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import AdminMessageRequest from "../../../models/AdminMessageRequest";
import MessageModel from "../../../models/MessageModel";
import { Pagination } from "../../Utils/Pagination";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { AdminMessage } from "./AdminMessage";

export const AdminMesssages =() =>{
    const {authState} = useOktaAuth();
    //Normal Loading Process
    const[isLoadingMessages,setIsLoadingMessages] = useState(true);
    const [httpError,setHttpError] = useState(null);
    //Message Endpoint state
    const[messages,setMessages] = useState<MessageModel[]>([]);
    const [messagePerPage] = useState(5);
    //Pagination
    const[currentPage,setCurrentPage] = useState(1);
    const[totalPages,setTotalPages] = useState(0);
    //Recall Effect
    const [btnSubmit,setBtnSubmit] = useState(false);
    useEffect(() =>{
        const fetchMessagesUrl = async() =>{
            if(authState && authState.isAuthenticated){
                const url = `${process.env.REACT_APP_API}/messages/search/findByClose?close=false&page=${currentPage-1}&size=${messagePerPage}`;
                const requestOptions = {
                    method:'GET',
                    headers:{
                        Authorization:`Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type':'application/json'
                    }
                };
                const mesResponse = await fetch(url,requestOptions);
                if(!mesResponse.ok){
                    throw new Error('Something went wrong!!');
                }
                const msgResponseJson = await mesResponse.json();
                setMessages(msgResponseJson._embedded.messages);
                setIsLoadingMessages(false);
            }
        }
        fetchMessagesUrl().catch((error:any)=>{
            setHttpError(error.message);
            setIsLoadingMessages(false);
        })
        window.scrollTo(0,0);

    },[authState,currentPage,btnSubmit]);
    if(isLoadingMessages){
        return(
            <SpinnerLoading/>
        )
    }
    if(httpError){
        return(
            <div>
                <div className="container m-5">
                    <p>{httpError}</p>
                </div>
            </div>
        )
    }
    async function submitResponseToQuestion(id:number,response:string){
        const url =`${process.env.REACT_APP_API}/messages/secure/admin/message`;
        if(authState && authState.isAuthenticated && id!==null && response!==''){
            const adminMessage : AdminMessageRequest= new AdminMessageRequest(id,response);
            const requestOptions = {
                method:'PUT',
                headers:{
                    Authorization:`Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(adminMessage)
            };
            const rep = await fetch(url,requestOptions);
            if(!rep.ok){
                throw new Error("Something went wrong!!");
            }
            setBtnSubmit(!btnSubmit);
        }
    }
    const pageNumber = (page:number)=>setCurrentPage(page);
    return (
        <div className="mt-3">
            {messages.length > 0 ?
            <>
                <h5>Pending Q/A:</h5>
                {messages.map(mesg =>(
                    <AdminMessage message={mesg} key={mesg.id} SubmitResponseToQuestions={submitResponseToQuestion}/>
                ))}
            </>
            
            :<>No pending Q/A</>
            }
            {totalPages>1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={pageNumber}/>}
        </div>
    );
}