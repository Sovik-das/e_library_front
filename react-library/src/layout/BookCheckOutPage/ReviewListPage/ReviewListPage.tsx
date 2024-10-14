import { useEffect, useState } from "react";
import ReviewModel from "../../../models/ReviewModel";
import { Pagination } from "../../Utils/Pagination";
import { Review } from "../../Utils/Review";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";


export const ReviewListPage= () =>{
    const[reviews,setReviews] = useState<ReviewModel[]>([]);
    const [isLoading,setIsLoading] = useState(true);
    const[httpError,setHttpError] = useState(null);
    const[currentPage,setCurrentPage] = useState(1);
    const[reviewsPerPage] = useState(5);
    const[totalAmountOfReviews,setTotalAmountOfReviews] = useState(0);
    const[totalPages,setTotalPages] = useState(0);   
    const bookId = (window.location.pathname).split("/")[2];
    useEffect(() =>{
        const fetchReview = async() =>{
            const reviewUrl:string=`${process.env.REACT_APP_API}/reviews/search/findByBookId?book_Id=${bookId}&pages=${currentPage-1}&size=${reviewsPerPage}`;
            const responseReview = await fetch(reviewUrl);
            if(!responseReview.ok){
                throw new Error("Something went wrong while fetching review");
            }
            const responseReviewJson = await responseReview.json();
            const reviewData = responseReviewJson._embedded.reviews;
            setTotalAmountOfReviews(responseReviewJson.page.totalElements);
            setTotalPages(responseReviewJson.page.totalElements);
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
            }
            setReviews(loadedReview);
            setIsLoading(false);
        }
        fetchReview().catch((error:any) =>{
            setIsLoading(false);
            setHttpError(error.message);
        })
    },[currentPage]);
    if(isLoading){
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
    const indexOfLastReview:number = currentPage*reviewsPerPage;
    const indexOfFirstReview:number = indexOfLastReview - reviewsPerPage;
    let lastItem = reviewsPerPage * currentPage<= totalAmountOfReviews? reviewsPerPage * currentPage:totalAmountOfReviews;
    const paginate = (pageNumber:number) => setCurrentPage(pageNumber);
    return(
        <div className="container m-5">
            <div>
                <h3>Comments:({reviews.length})</h3>
            </div>
            <p>
                {indexOfFirstReview+1} to {lastItem} of {totalAmountOfReviews} Items:
            </p>
            <div className="row">
                {reviews.map(review=>(
                    <Review review={review} key={review.id}/>
                ))}
            </div>
            {totalPages>1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}