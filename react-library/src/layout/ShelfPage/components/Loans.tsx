import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ShelfCurrentLoan from "../../../models/ShelfCurrentLoan";
import { ReturnBook } from "../../HomePage/Components/ReturnBooks";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { LoansModal } from "./LoansModal";

export const Loans = () => {
    const { authState } = useOktaAuth();
    const [httpError, setHttpError] = useState(null);

    const [shelfCurrentLoan, setshelfCurrentLoan] = useState<ShelfCurrentLoan[]>([]);
    const [isshelfCurrentLoanLoading, setIsshelfCurrentLoanLoading] = useState(true);
    const [checkOut,setCheckOut] = useState(true);
    const [renewLoan,setRenewLoan] = useState(false);
    useEffect(() => {
        const fetchshelfCurrentLoans = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/books/secure/currentloans`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `bearer ${authState.accessToken?.accessToken}`,
                        "Content-Type": 'application/json'
                    }
                };
                const shelfCurrentLoanResp = await fetch(url, requestOptions);
                if (!shelfCurrentLoanResp.ok) {
                    throw new Error("Something went wrong!");
                }
                const shelfCurrentLoanJson = await shelfCurrentLoanResp.json();
                setshelfCurrentLoan(shelfCurrentLoanJson);
            }
            setIsshelfCurrentLoanLoading(false);
        }
        fetchshelfCurrentLoans().catch((error: any) => {
            setIsshelfCurrentLoanLoading(false);
            setHttpError(error.message);
        })
        window.scroll(0, 0);
    }, [authState,checkOut,renewLoan]);
    if (isshelfCurrentLoanLoading) {
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
    async function returnBook(bookId:number){
        const url = `${process.env.REACT_APP_API}/books/secure/return?bookid=${bookId}`;
        const requestOptions = {
            method:'PUT',
            headers:{
                Authorization:`Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type':'application/json'
            }
        };
        const response = await fetch(url,requestOptions);
        if(!response.ok){
            throw new Error('Something went wrong!');
        }
        setCheckOut(!checkOut);

    }
    async function renewBookLoan(bookId:number){
        const url = `${process.env.REACT_APP_API}/books/secure/renewLoan?bookid=${bookId}`;
        const requestOptions = {
            method:'PUT',
            headers:{
                Authorization:`Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type':'application/json'
            }
        };
        const response = await fetch(url,requestOptions);
        if(!response.ok){
            throw new Error('Something went wrong!');
        }
        setRenewLoan(!renewLoan);

    }
    return (
        <div>
            {/*Desktop*/}
            <div className="d-none d-lg-block mt-2">
                {shelfCurrentLoan.length > 0 ?
                    <>
                        <h5>Current Loans:</h5>
                        {shelfCurrentLoan.map(ele => (
                            <div key={ele.book.id}>
                                <div className="row mt-3 mb-3">
                                    <div className='col-4 col-md-4 container'>
                                        {ele.book?.img ?
                                            <img src={ele.book?.img} width="226" height="349" alt="book" />
                                            :
                                            <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} width="226" height="349" alt="book" />
                                        }
                                    </div>
                                    <div className="card col-3 col-md-3 container d-flex">
                                        <div className="card-body">
                                            <div className="mt-3">
                                                <h4>Loan Options</h4>
                                                {ele.daysleft > 0 &&
                                                    <p className="text-secondary">
                                                        Due in {ele.daysleft} days.
                                                    </p>

                                                }
                                                {ele.daysleft == 0 &&
                                                    <p className="text-secondary">
                                                        Due Today.
                                                    </p>

                                                }
                                                {ele.daysleft < 0 &&
                                                    <p className="text-danger">
                                                        Past due by {ele.daysleft} days.
                                                    </p>

                                                }
                                                <div className="list-group mt-3">
                                                    <button className="list-group-item list-group-item-action"
                                                        arial-current="true" data-bs-toggle="modal" data-bs-target={`#modal${ele.book.id}`}>
                                                        Manage Loan
                                                    </button>
                                                    <Link to={'search'} className="list-group-item list-group-item-action">
                                                        Search more books?
                                                    </Link>
                                                </div>
                                            </div>
                                            <hr />
                                            <p className="mt-3">
                                                Help other find their adventure by reviewing your loan.
                                            </p>
                                            <Link to={`/checkout/${ele.book.id}`} className="btn btn-primary">
                                                Leave a review
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                                <hr />
                                <LoansModal shelfCurrentLoan={ele} mobile={false} returnBook={returnBook} renewLoan={renewBookLoan} />
                            </div>
                        ))}
                    </>
                    :
                    <>
                        <h3 className="mt-3">
                            Currently no loans
                        </h3>
                        <Link to={`search`} className="btn btn-primary">
                            Search for a new book
                        </Link>
                    </>
                }
            </div>
            {/*Mobile*/}
            <div className="container d-lg-none mt-2">
                {shelfCurrentLoan.length > 0 ?
                    <>
                        <h5 className="mb-3">Current Loans:</h5>
                        {shelfCurrentLoan.map(ele => (
                            <div key={ele.book.id}>
                                    <div className='d-flex justify-content-center align-items-center'>
                                        {ele.book?.img ?
                                            <img src={ele.book?.img} width="226" height="349" alt="book" />
                                            :
                                            <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} width="226" height="349" alt="book" />
                                        }
                                    </div>
                                    <div className="card d-flex mt-5 mb-3">
                                        <div className="card-body container">
                                            <div className="mt-3">
                                                <h4>Loan Options</h4>
                                                {ele.daysleft > 0 &&
                                                    <p className="text-secondary">
                                                        Due in {ele.daysleft} days.
                                                    </p>

                                                }
                                                {ele.daysleft == 0 &&
                                                    <p className="text-secondary">
                                                        Due Today.
                                                    </p>

                                                }
                                                {ele.daysleft < 0 &&
                                                    <p className="text-danger">
                                                        Past due by {ele.daysleft} days.
                                                    </p>

                                                }
                                                <div className="list-group mt-3">
                                                    <button className="list-group-item list-group-item-action"
                                                        arial-current="true" data-bs-toggle="modal" data-bs-target={`#mobilemodal${ele.book.id}`}>
                                                        Manage Loan
                                                    </button>
                                                    <Link to={'search'} className="list-group-item list-group-item-action">
                                                        Search more books?
                                                    </Link>
                                                </div>
                                            </div>
                                            <hr />
                                            <p className="mt-3">
                                                Help other find their adventure by reviewing your loan.
                                            </p>
                                            <Link to={`/checkout/${ele.book.id}`} className="btn btn-primary">
                                                Leave a review
                                            </Link>
                                        </div>
                                    </div>

                                
                                <hr />
                                <LoansModal shelfCurrentLoan={ele} mobile={true} returnBook={returnBook} renewLoan={renewBookLoan} />
                            </div>
                        ))}
                    </>
                    :
                    <>
                        <h3 className="mt-3">
                            Currently no loans
                        </h3>
                        <Link to={`search`} className="btn btn-primary">
                            Search for a new book
                        </Link>
                    </>
                }
            </div>
        </div>
    );
}