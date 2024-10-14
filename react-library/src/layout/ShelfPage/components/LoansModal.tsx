import ShelfCurrentLoan from "../../../models/ShelfCurrentLoan";

export const LoansModal: React.FC<{ shelfCurrentLoan: ShelfCurrentLoan, mobile: boolean ,returnBook:any,renewLoan:any}> = (props) => {
    return (
        <div className="modal fade" id={props.mobile ? `mobilemodal${props.shelfCurrentLoan.book.id}` :
            `modal${props.shelfCurrentLoan.book.id}`} data-bs-backdrop='static' data-bs-keyboard='false'
            aria-labelledby="staticBackdropLabel" arial-hidden='true' key={props.shelfCurrentLoan.book.id}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">
                            Loan Options
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" arial-label="Close">

                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="container">
                            <div className="mt-3">
                                <div className="row">
                                    <div className="col-2">
                                        {props.shelfCurrentLoan.book.img ?
                                            <img src={props.shelfCurrentLoan.book?.img} width="56" height="87" alt="Book" /> :
                                            <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                                width="56" height="87" alt="Book" />
                                        }
                                    </div>
                                    <div className="col-10">
                                        <h6>{props.shelfCurrentLoan.book.author}</h6>
                                        <h4>{props.shelfCurrentLoan.book.title}</h4>
                                    </div>
                                </div>
                                <hr />
                                {props.shelfCurrentLoan.daysleft > 0 &&
                                    <p className="text-secondary">
                                        Due in {props.shelfCurrentLoan.daysleft} days.
                                    </p>

                                }
                                {props.shelfCurrentLoan.daysleft == 0 &&
                                    <p className="text-secondary">
                                        Due Today.
                                    </p>

                                }
                                {props.shelfCurrentLoan.daysleft < 0 &&
                                    <p className="text-danger">
                                        Past due by {props.shelfCurrentLoan.daysleft} days.
                                    </p>

                                }
                                <div className="list-group mt-3">
                                    <button onClick={()=>{props.returnBook(props.shelfCurrentLoan.book.id)}} data-bs-dismiss='modal' className="list-group-item list-group-item-action"
                                    arial-current="true">
                                        Return Book
                                    </button>
                                    <button onClick={(event)=>{
                                        props.shelfCurrentLoan.daysleft<0?
                                        event.preventDefault()
                                        :
                                        props.renewLoan(props.shelfCurrentLoan.book.id)}} className={
                                        props.shelfCurrentLoan.daysleft<0?
                                        "list-group-item list-group-item-action inactiveLink":
                                        "list-group-item list-group-item-action"
                                    } data-bs-dismiss='modal'>
                                        {props.shelfCurrentLoan.daysleft<0?
                                        "Last dues cannot be removed":"Renew loan for 7 days"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
                                            Close
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}