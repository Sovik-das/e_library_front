import React, { useState } from "react";
import { StarReview } from "./StarReview";

export const LeaveAReview :React.FC<{submitReview:any}> = (props) =>{
    const [starInput,setStarInput] = useState(0);
    const [displayInput,setDisplayInput] = useState(false);
    const [reviewDescription,setReviewDescription] = useState('');
    function starValue(value:number){
        setStarInput(value);
        setDisplayInput(true);
    }
    return(
        <div className="dropdown" style={{cursor:'pointer'}}>
            <h5 className="dropdown-toggle" id = 'dropdownMenuButton1' data-bs-toggle='dropdown'>

            </h5>
            <ul className="dropdown-menu" id='submitReviewButton' aria-labelledby="dropdownMenuButton1"> 
                <li>
                    <button className="dropdown-item" onClick={()=>starValue(0)}>0 start</button>
                    <button className="dropdown-item" onClick={()=>starValue(.5)}>.5 start</button>
                    <button className="dropdown-item" onClick={()=>starValue(1)}>1 start</button>
                    <button className="dropdown-item" onClick={()=>starValue(1.5)}>1.5 start</button>
                    <button className="dropdown-item" onClick={()=>starValue(2)}>2 start</button>
                    <button className="dropdown-item" onClick={()=>starValue(2.5)}>2.5 start</button>
                    <button className="dropdown-item" onClick={()=>starValue(3)}>3 start</button>
                    <button className="dropdown-item" onClick={()=>starValue(3.5)}>3.5 start</button>
                    <button className="dropdown-item" onClick={()=>starValue(4)}>4 start</button>
                    <button className="dropdown-item" onClick={()=>starValue(4.5)}>4.5 start</button>
                    <button className="dropdown-item" onClick={()=>starValue(5)}>5 start</button>

                </li>
            </ul>
            <StarReview rating={starInput} size={32}/>
            {displayInput && 
                <form method='POST' action='#'>
                    <hr/>
                    <div className="mb-3">
                        <label className="form-label">
                            Description
                        </label>
                        <textarea className="form-control" id="submitReviewDescription" placeholder="Optional"
                        rows={3} onChange={e=>setReviewDescription(e.target.value)}>

                        </textarea>
                    </div>
                    <div>
                        <button type="button" onClick={()=>props.submitReview(starInput,reviewDescription)} className="btn btn-primary mt-3">
                            Submit Review
                        </button>
                    </div>
                </form>
            }
        </div>
    );
}