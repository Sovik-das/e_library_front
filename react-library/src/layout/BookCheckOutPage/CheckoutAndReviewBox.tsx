import React from "react";
import { Link } from "react-router-dom";
import BookModel from "../../models/BookModel";
import { LeaveAReview } from "../Utils/LeaveAReview";

export const CheckoutAndReviewBox :React.FC<{book:BookModel|undefined,mobile:boolean,currentLoanCount:number,
    isChekedOut:boolean,isAuthenticated:any,checkOutBook:any,isReviewLeft:boolean,submitReview:any}> = (props) => {
    
    function buttonRender(){
        if(props.isAuthenticated){
            if(!props.isChekedOut && props.currentLoanCount<5){
                return (<button className="btn btn-success btn-lg" onClick={()=>props.checkOutBook()}>Checkout</button>)
            }else if(props.isChekedOut){
                return(<p><b>Book checked out. Enjoy!</b></p>)
            }else if(!props.isChekedOut){
                return (<p className="text-danger">Too many books checked out.</p>)
            }
        }
        return (<Link to={'/Login'} className="btn btn-success btn-lg">Sign in</Link>)
        
    }
    function reviewRender(){
        if(props.isAuthenticated && !props.isReviewLeft){
            return(<p>
                <LeaveAReview submitReview={props.submitReview}/>
            </p>);
        }else if(props.isReviewLeft && props.isAuthenticated){
            return(
                <p>
                    <b>Thank you for your review!</b>
                </p>
            );
        }
        return (<div>
            <hr/>
            <p>
            Sign in to be available to leave a review.
            </p>
        </div>)
    }
    return(
        <div className={props.mobile?'card d-flex mt-5':'card col-3 container d-flex md-5'}>
            <div className="card-body-container">
                <div className="mt-3">
                    <p>
                        <b>{props.currentLoanCount}/5 </b>
                        books check out
                    </p>
                    <hr/>
                    {props.book && props.book.copiesAvailable && props.book.copiesAvailable > 0 ?
                    <h4 className="text-success">
                        Available
                    </h4>:
                    <h4 className="text-danger">
                        Wait List
                    </h4>
                }
                <div className="row ">
                    <p className="col-6 lead">
                       <b>{props.book?.copies} </b> 
                        copies
                    </p>
                    <p className="col-6 lead">
                       <b>{props.book?.copiesAvailable} </b> 
                        available
                    </p>
                </div>
                </div>
                {buttonRender()}
                <p className="mt-3">
                    This number can change until placing order has been completed.
                </p>
               {reviewRender()}
            </div>
        </div>
    );
}