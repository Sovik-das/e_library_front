import { useOktaAuth } from "@okta/okta-react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PaymentInfoRequest from "../../models/PaymentInfoRequest";
import { SpinnerLoading } from "../Utils/SpinnerLoading";

export const PaymentPage = () =>{
const {authState} = useOktaAuth();    
const [httpError,setHttpError] = useState(null);
const[diableSubmit,setDisableSubmit] = useState(false);
const [fees,setFees] = useState(0);
const[loadingFees,setLoadingFees] = useState(true);
useEffect(()=>{
    const fetchfees = async () =>{
        if(authState && authState.isAuthenticated){
            const url = `${process.env.REACT_APP_API}/payments/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}`;
            const requestOptions={
                method:'GET',
                headers:{
                    Authorization:`Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type':'application/json'
                }
            };
            const feesResp = await fetch(url,requestOptions);
            if(!feesResp.ok){
                throw new Error("Something went wrong!!");
            }
            const RespJson = await feesResp.json();
            setFees(RespJson.amount);
            setLoadingFees(false);
        }
    }
    fetchfees().catch((error:any)=>{
        setLoadingFees(true);
        setHttpError(error.message);
    })
},[authState]);
const elements =  useElements();
const stripe = useStripe();
async function checkout(){
    if(!stripe || !elements || !elements.getElement(CardElement)){
        return;
    }

    let paymentInfo = new PaymentInfoRequest(Math.round(fees*100),'USD',authState?.accessToken?.claims.sub);
    const url=`${process.env.REACT_APP_API}/secure/payment/payment-intent`;
    const requestOptions={
        method:'POST',
        headers:{
            Authorization:`Bearer ${authState?.accessToken?.accessToken}`,
            'Content-Type':'application/json'
        },
        body : JSON.stringify(paymentInfo)
    };
    const stripeResp = await fetch(url,requestOptions);
    if(!stripeResp.ok){
        setDisableSubmit(false);
        throw new Error("Something went wrong!");
    }
    const stripeJSON = await stripeResp.json();
    stripe.confirmCardPayment(
        stripeJSON.client_secret,{
            payment_method:{
                card:elements.getElement(CardElement)!,
                billing_details:{
                    email: authState?.accessToken?.claims.sub
                }
            }
        },{handleActions:false}
    ).then(async function (result:any){
        if(result.error){
            setDisableSubmit(false);
            alert("There was an error!");
        }else{
            const url=`${process.env.REACT_APP_API}/secure/payment/payment-complete`;
            const requestOptions={
                method:'PUT',
                headers:{
                    Authorization:`Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type':'application/json'
                },
            };
            const resp = await fetch(url,requestOptions);
            if(!resp.ok){
                setDisableSubmit(false);
                throw new Error("Something went wrong!");
            }
            setFees(0);
            setDisableSubmit(false);
        }
    })
}
if(loadingFees){
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

    return (
    <div className="container">
        {fees>0 &&
            <div className="card mt-3">
                <h5 className="card-header">
                    Fees pending:<span className="text-danger">${fees}</span>
                    <div className="card-body">
                        <h5 className="card-title-mb-3">
                        Credit Card
                        </h5>
                        <CardElement id='card-element'/>
                        <button className="btn btn-md main-color text-white mt-3" disabled={diableSubmit} type="button"
                        onClick={checkout}>
                            Pay fees
                        </button>
                    </div>
                </h5>
            </div>
        }
        {fees ===0 &&
            <div className="mt-3">
                <h5>You have no fees!</h5>
                <Link type='button' className='btn main-color text-white' to='search'>
                    Explore top books
                </Link>
            </div>
        }
        {diableSubmit && <SpinnerLoading/>}
    </div>
    );
}