import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import { AddNewBook } from "./components/AddNewBook";
import { AdminMesssages } from "./components/AdminMessages";
import { ChangeQuantityOfBooks } from "./components/ChangeQuantityOfBooks";

export const ManageLibraryPage = () =>{
    const {authState} = useOktaAuth();
    const [changeQuantityofBooksClick,setChangeQuantityofBooksClick] = useState(false);
    const[messageClick,setMessageClick] = useState(false);
    function addBooksClick(){
        setChangeQuantityofBooksClick(true);
        setMessageClick(true);
    }
    function changeQuantityofBooks(){
        setChangeQuantityofBooksClick(true);
        //console.log("changeQuantityofBooksClick="+changeQuantityofBooksClick);
        setMessageClick(false);
    }
    function messageClickFunction(){
        setChangeQuantityofBooksClick(false);
        setMessageClick(true);
        //console.log("messageClick="+messageClick);
    }
    if(authState?.accessToken?.claims.userType===undefined){
        return <Redirect to="/home"/>
    }
    return(
        <div className="container">
            <div className="mt-5">
                <h3>Manage Library</h3>
                <nav>
                    <div  className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button  onClick={addBooksClick} className="nav-link active" id="nav-add-book-tab" data-bs-toggle="tab"
                        data-bs-target="#nav-add-book" type="button" role="tab" aria-controls="nav-add-book"
                        aria-selected="false">
                            Add new book
                        </button>
                        <button onClick={changeQuantityofBooks} className="nav-link" id="nav-quantity-tab" data-bs-toggle="tab"
                        data-bs-target="#nav-quantity" type="button" role="tab" aria-controls="nav-quantity"
                        aria-selected="true">
                            Change Quantity
                            
                        </button>
                        <button onClick={messageClickFunction} className="nav-link" id="nav-messages-tab" data-bs-toggle="tab"
                        data-bs-target="#nav-messages" type="button" role="tab" aria-controls="nav-messages"
                        aria-selected="false">
                            Messages
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-add-book" role="tabpanel"
                     aria-labelledby="nav-add-book-tab">
                         <AddNewBook/>
                    </div>
                    <div className="tab-pane fade " id="nav-quantity" role="tabpanel"
                     aria-labelledby="nav-quantity-tab">
                        {changeQuantityofBooksClick? <ChangeQuantityOfBooks/>:<></>}
                    </div>
                    <div className="tab-pane fade " id="nav-messages" role="tabpanel"
                     aria-labelledby="nav-message-tab">
                         {messageClick? <AdminMesssages/>:<></>}
                    </div>
                </div>
            </div>
        </div>
    );
}