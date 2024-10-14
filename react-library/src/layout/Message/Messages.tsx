import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import MessageModel from "../../models/MessageModel";
import { Pagination } from "../Utils/Pagination";
import { SpinnerLoading } from "../Utils/SpinnerLoading";

export const Messages = () =>{
    const {authState} = useOktaAuth();
    const[isLoadingMessages,setIsLoadingMessages] = useState(true);
    const[httpError,setHttpError] = useState(null);
    const[message,setMessage] = useState<MessageModel[]>([]);
    const[messagesPerPage] = useState(5);
    const[currentPage,setCurrentPage]= useState(1);
    const[totalPages,setTotalPages]= useState(0);
    useEffect(()=>{
        const fetchmsg = async ()=>{
            if(authState && authState?.isAuthenticated){
                const url=`${process.env.REACT_APP_API}/messages/search/findByUserEmail?useremail=${authState.accessToken?.claims.sub}&page=${currentPage-1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                };
                const response = await fetch(url,requestOptions);
                if(!response.ok){
                    throw new Error("Something went wrong!!");
                }
                const responseJson = await response.json();
                setMessage(responseJson._embedded.messages);
                setTotalPages(responseJson.page.totalPages);
            }
            setIsLoadingMessages(false);
        }
        fetchmsg().catch((error:any)=>{
            setIsLoadingMessages(false);
            setHttpError(error.message);
        })
        window.scrollTo(0,0);
    },[authState,currentPage])
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
    const pageNumber = (page:number)=>setCurrentPage(page);
    return (
        <div className="mt-2">
            {message.length>0?
                <>
                    <h5>Current Q/A:</h5>
                    {message.map(msg=>(
                        <div key={msg.id}>
                            <div className="card mt-2 shadow p-3 bg-body rounded">
                                <h5>Case#{msg.id}:{msg.title}</h5>
                                <h6>{msg.userEmail}</h6>
                                <p>{msg.question}</p>
                                <hr/>
                                <div>
                                    <h5>Response:</h5>
                                    {msg.response && msg.adminEmail?
                                        <>
                                            <h6>{msg.adminEmail} (admin)</h6>
                                            <p>{msg.response}</p>
                                        </>
                                        :
                                        <p>
                                            <i>Pending response from administration. Please be patient.</i>
                                        </p>
                                    }
                                </div>

                            </div>
                        </div>
                    ))}
                </>
                :
                <h5>All questions you submit will be shown here</h5>
            }
            {totalPages>1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={pageNumber}/>}
        </div>
    );
}