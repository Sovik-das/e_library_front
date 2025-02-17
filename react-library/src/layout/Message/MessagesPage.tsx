import { useState } from "react"
import { Messages } from "./Messages";
import { PostNewMessage } from "./PostNewMessage";

export const MessagesPage = () =>{
    const [messageClick,setMessageClick] = useState(false);
    return (
        <div className="container">
            <div className="mt-3 mb-2">
                <nav>
                    <div className="nav nav-tabs" id ="nav-tab" role="tablist">
                        <button onClick={()=>setMessageClick(false)} className="nav-link active"
                        id="nav-send-message-tab" type="button" role="tab"data-bs-toggle="tab" data-bs-target="#nav-send-message" aria-controls="nav-send-message" aria-selected="true"
                        >
                            Submit Question

                        </button>
                        <button onClick={()=>setMessageClick(true)} className="nav-link"
                        id="nav-message-tab" data-bs-toggle="tab" type="button" role="tab" data-bs-target="#nav-message" aria-controls="nav-message"aria-selected="false"
                        >
                            Q/A Response/Pending

                        </button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-send-message" role="tabpanel" aria-labelledby="nav-send-message-tab">
                        <PostNewMessage/>
                    </div>
                    <div className="tab-pane fade show" id="nav-message" role="tabpanel" aria-labelledby="nav-message-tab">
                        {messageClick?<Messages/>:<></>}
                    </div>
                </div>
            </div>
        </div>
    );
}