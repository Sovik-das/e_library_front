import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HistoryModel from "../../../models/HistoryModel";
import { Pagination } from "../../Utils/Pagination";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";

export const HistoryPage= () =>{
    const { authState } = useOktaAuth();
    const [httpError, setHttpError] = useState(null);
    const[isLoadingHistory,setIsLoadingHistory] = useState(true);
    const [hitories,setHistories] = useState<HistoryModel[]>([]);
    const [currentPage,setCurrentPage] = useState(1);
    const[totalPage,setTotalPage] = useState(0);
    useEffect(()=>{
        const fetchHistory = async ()=>{
            if( authState && authState?.isAuthenticated){
                const url =`${process.env.REACT_APP_API}/histories/search/findBooksByUserEmail?email=${authState.accessToken?.claims.sub}&page=${currentPage-1}&size=5`;
                const requestOptions = {
                    method:'GET',
                    headers:{
                        'Content-Type':'application/json'
                    }
                };
                const response = await fetch(url,requestOptions);
                if(!response.ok){
                    throw new Error("Something went wrong!");
                }
                const historyJson = await response.json();
                setHistories(historyJson._embedded.histories);
                setTotalPage(historyJson.page.totalPages);
            }
            setIsLoadingHistory(false);
        }
        fetchHistory().catch((error:any)=>{
            setIsLoadingHistory(false)
            setHttpError(error.message)
            
        })

    },[authState,currentPage]);
    if (isLoadingHistory) {
        return (
            <SpinnerLoading />
        )
    }
    if (httpError) {
        return (
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
            {hitories.length >0 ?
                <>
                    <h5>Recent History:</h5>
                    {hitories.map(history=>(
                        <div key={history.id}>
                            <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
                                <div className="row g-0">
                                    <div className="col-md-2">
                                        <div className="d-none d-lg-block">
                                            {history.image?
                                                <img src={history.image} width="123" height="196" alt="book" />
                                                :
                                                <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} width="123" height="196" alt="book" />
                                            }
                                        </div>
                                        <div className="d-lg-none d-flex justify-content-centre align-items-centre">
                                            {history.image?
                                                <img src={history.image} width="123" height="196" alt="book" />
                                                :
                                                <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} width="123" height="196" alt="book" />
                                            }
                                        </div>
                                        
                                    </div>
                                    <div className="col">
                                        <div className="card-body">
                                            <h5 className="card-title">{history.author}</h5>
                                            <h4>{history.title}</h4>
                                            <p className="card-text">{history.description}</p>
                                            <hr/>
                                            <p className="card-text">Checked out on: {history.checkoutDate}</p>
                                            <p className="card-text">Returned on: {history.returnDate}</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
                :
                <>
                    <h3 className="mt-3">
                        Currently no history:
                    </h3>
                    <Link className="btn btn-primary" to={'search'}>
                        Search for new book
                    </Link>
                </>
            }
            {totalPage>1 && <Pagination currentPage={currentPage} totalPages={totalPage} paginate={pageNumber}/>}
        </div>
    );
}