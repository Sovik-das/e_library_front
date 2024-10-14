import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import ReviewModel from "../../models/ReviewModel";
import ReviewRequestModel from "../../models/ReviewRequestModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarReview } from "../Utils/StarReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviews } from "./LatestReviews";

export const BookCheckOutPage = () =>{
    const {authState} = useOktaAuth();
    const[book,setBook] = useState<BookModel>();
    const [isLoding,setIsLoading] = useState(true);
    const[httperror,setHttpError] = useState(null);

    //Review State
    const[review,setReview] = useState<ReviewModel[]>([]);
    const [totalstars,setTotalstars] = useState(0);
    const[isReviewLoading,setIsReviewLoading] = useState(true);
    const [isReviewLeft,setIsReviewLeft] = useState(false);
    //Loans Current State 
    const[currentLoansCount,setCurrentLoansCount] = useState(0);
    const[isLoadingCurrentLoansCount,setLoadingCurrentLoansCount] = useState(true);
    //Is Book Checked Out
    const[isCheckedOut,setIsCheckedOut] = useState(false);
    const[isLoadingCheckedOut,setIsLoadingCheckedOut] = useState(true);
    //Payment
    const[displayError,setDisplayError]=useState(false);
    const bookId = (window.location.pathname).split("/")[2];
    useEffect(()=>{
        const fetchBook = async() =>{
            const baseUrl:string=`${process.env.REACT_APP_API}/books/${bookId}`;
            const url:string = `${baseUrl}?page=0&size=9`;
            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Something went wrong!");
            }
            const responseJson = await response.json();
           // const responseData = responseJson._embedded.books;
            const loadedBooks:BookModel = {
                id: responseJson.id,
                    title: responseJson.title,
                    description: responseJson.description,
                    author: responseJson.author,
                    copies: responseJson.copies,
                    copiesAvailable : responseJson.copies_available,
                    category: responseJson.category,
                    img: responseJson.img
            };
            
            setBook(loadedBooks);
            setIsLoading(false);
        };
        fetchBook().catch((error:any)=>{
            setIsLoading(false);
            setHttpError(error.message);
        })
    },[isCheckedOut]);

    //Review UseEffect
    useEffect(() =>{
        const fetchReview = async() =>{
            const reviewUrl:string=`${process.env.REACT_APP_API}/reviews/search/findByBookId?book_Id=${bookId}`;
            const responseReview = await fetch(reviewUrl);
            if(!responseReview.ok){
                throw new Error("Something went wrong while fetching review");
            }
            const responseReviewJson = await responseReview.json();
            const reviewData = responseReviewJson._embedded.reviews;
            let weightedReviewStart:number=0;
            const loadedReview:ReviewModel[] =[];
            for(const key in reviewData){
                loadedReview.push({
                    id:reviewData[key].id,
                    userEmail:reviewData[key].userEmail,
                    description:reviewData[key].reviewDescription,
                    book_Id:reviewData[key].bookId,
                    date:reviewData[key].date,
                    rating:reviewData[key].rating
                });
                weightedReviewStart+=reviewData[key].rating;
            }
            if(loadedReview){
                const round = (Math.round((weightedReviewStart/loadedReview.length)*2)/2).toFixed(1);
                setTotalstars(Number(round));
            }
            setReview(loadedReview);
            setIsReviewLoading(false);
        }
        fetchReview().catch((error:any) =>{
            setIsReviewLoading(false);
            setHttpError(error.message);
        })
    },[]);

    useEffect(()=>{
        const fetchuserReviewBook = async ()=>{
            if(authState&&authState.isAuthenticated){
                const url =`${process.env.REACT_APP_API}/reviews/secure/user/book?bookId=${bookId}`;
                const requestOptions={
                    method:'GET',
                    headers:{
                        Authorization:`Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type':'application/json'
                    }
                };
                const userReviewResp = await fetch(url,requestOptions);
                if(!userReviewResp.ok){
                    throw new Error("Something went wrong!!");
                }
                const userReviewJson = await userReviewResp.json();
                setIsReviewLeft(userReviewJson);
            }
            setIsReviewLoading(false);
        }
        fetchuserReviewBook().catch((error:any)=>{
            setIsReviewLoading(false);
            setHttpError(error.message);
        })
    },[isReviewLeft]);
    //Loans UseEffect
    useEffect(()=>{
        const fectchCurrentLoansCount = async()=>{
            if(authState && authState.isAuthenticated){
                const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;
                const requestOptions = {
                    method:'GET',
                    headers:{
                        Authorization:`Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type':'application/json'
                    }
                };
                const currentLoanCountResponse = await fetch(url,requestOptions);
                if(!currentLoanCountResponse.ok){
                    throw new Error("Something went wrong!!");
                }
                const currentLoanCountRespJson = await currentLoanCountResponse.json();
                setCurrentLoansCount(currentLoanCountRespJson);
            }
            setLoadingCurrentLoansCount(false);
        }
        fectchCurrentLoansCount().catch((error:any)=>{
            setLoadingCurrentLoansCount(false);
            setHttpError(error.message);
        })

        
    },[authState,isCheckedOut]);
    //IsCheckedOut Books
    useEffect(()=>{
        const fetchCheckedOut = async() =>{
            if(authState&&authState.isAuthenticated){
                const url =`${process.env.REACT_APP_API}/books/secure/ischeckout/byuser?bookId=${bookId}`;
                const requestOptions={
                    method:'GET',
                    headers:{
                        Authorization:`Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type':'application/json'
                    }
                };
                const bookCheckedOutResp = await fetch(url,requestOptions);
                if(!bookCheckedOutResp.ok){
                    throw new Error("Something went wrong!!");
                }
                const bookCheckedOutJson = await bookCheckedOutResp.json();
                setIsCheckedOut(bookCheckedOutJson);
            }
            setIsLoadingCheckedOut(false);
        }
        fetchCheckedOut().catch((error:any)=>{
            setIsCheckedOut(false);
            setHttpError(error.message);
        })
    },[authState])
    if(isLoding || isReviewLoading|| isLoadingCurrentLoansCount || isLoadingCheckedOut || isReviewLoading){
        return(
            <SpinnerLoading/>
        )
    }
    if(httperror){
        return(
            <div>
                <div className="container m-5">
                    <p>{httperror}</p>
                </div>
            </div>
        )
    }
    async function checkoutBook(){
        const url =`${process.env.REACT_APP_API}/books/secure/checkout?id=${book?.id}`;
        const requestOptions ={
            method:'PUT',
            headers:{
                Authorization:`Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type':'application/json'
            }

        };
        const checkoutBookResp = await fetch(url,requestOptions);
        if(!checkoutBookResp.ok){
            throw new Error("Something Went Wrong!!");
        }
        const JsonResp = await checkoutBookResp.json();
        if(JsonResp.id===null){
            setDisplayError(true);
            setIsCheckedOut(false);
        }else{
            setIsCheckedOut(true);
            setDisplayError(false);
        }
        
    }
    async function submitReview(starInput:number,review:string){
        let bookId=0;
        if(book?.id){
            bookId=book.id;
        }
        const reviewRequestModel = new ReviewRequestModel(starInput,bookId,review);
        const url = `${process.env.REACT_APP_API}/reviews/secure`;
        const requestOptions={
            method:'POST',
            headers:{
                Authorization:`bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type':'application/json'
            },
            body:JSON.stringify(reviewRequestModel)
        };
        const response = await fetch(url,requestOptions);
        if(!response.ok){
            throw new Error("Something went wrong!");
        }
        setIsReviewLeft(true);
    }
    return(
       <div> 
        <div className="container d-none d-lg-block">
            {displayError && 
            <div className="alert alert-danger mt-3" role="alert">
                Please pay outstanding fees and /or return late book(s).
                </div>}
            <div className="row mt-5">
                <div className="col-sm-2 col-md-2">
                    {book?.img?
                        <img src={book?.img} width='226'
                        height='349' alt='Book'/>
                     :
                     <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                     height='349' alt='Book'/>      
                    }
                </div>
                <div className="col-4 col-md-4 container">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        <StarReview rating={totalstars} size={32}/>
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={false} currentLoanCount={currentLoansCount} 
                isChekedOut={isCheckedOut} isAuthenticated={authState?.isAuthenticated} checkOutBook={checkoutBook}
                isReviewLeft={isReviewLeft} submitReview={submitReview}/>
            </div>
            <hr/>
            <LatestReviews reviews={review} BookId={book?.id} mobile={false}/>
        </div>
        <div className="container d-lg-none mt-5">
        {displayError && 
            <div className="alert alert-danger mt-3" role="alert">
                Please pay outstanding fees and /or return late book(s).
                </div>}
            <div className="d-flex justify-content-center align-items-center">
                {book?.img?
                        <img src={book?.img} width='226'
                        height='349' alt='Book'/>
                     :
                     <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                     height='349' alt='Book'/>      
                }
            </div> 
            <div className="mt-4">
                <div className="ml-2">
                    <h2>{book?.title}</h2>
                    <h5 className="text-primary">{book?.author}</h5>
                    <p className="lead">{book?.description}</p>
                    <StarReview rating={totalstars} size={32}/>
                </div>
            </div> 
            <CheckoutAndReviewBox book={book} mobile={true} currentLoanCount={currentLoansCount} isChekedOut={isCheckedOut} 
            isAuthenticated={authState?.isAuthenticated} checkOutBook={checkoutBook} isReviewLeft={isReviewLeft} 
            submitReview={submitReview}/>
            <hr/>    
            <LatestReviews reviews={review} BookId={book?.id} mobile={true}/>      
        </div>
       </div> 

    );
}