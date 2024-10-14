import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import MessageModel from "../../models/MessageModel";

export const PostNewMessage = () => {
    const { authState } = useOktaAuth();
    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [displayWarning, setdisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);
    async function submitNewQuestion() {
        const url = `${process.env.REACT_APP_API}/messages/secure/add/message`;
        if (authState?.isAuthenticated && title != '' && question != '') {
            const msgReqModel: MessageModel = new MessageModel(title, question);
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(msgReqModel)
            };
            console.log("requst="+requestOptions.headers.Authorization);
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error("Something went wrong!!");
            }
            setTitle('');
            setQuestion('');
            setdisplayWarning(false);
            setDisplaySuccess(true);
        } else {
            setDisplaySuccess(false);
            setdisplayWarning(true);
        }

    }
    return (
        <div className="card mt-3">
            <div className="card-header">
                Ask question to Admin
            </div>
            <div className="card-body">
                <form method="POST">
                    {displayWarning &&
                        <div className="alert alert-danger" role="alert">
                            All fields must be filled
                        </div>
                    }
                    {displaySuccess &&
                        <div className="alert alert-success" role="alert">
                            Question added successfully
                        </div>
                    }
                    <div className="mb-3 ">
                        <label className="form-label">
                            Title
                        </label>
                        <input type="text" className="form-control" id="formControl" placeholder="Title"
                            onChange={e => setTitle(e.target.value)} value={title}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">
                            Question
                        </label>
                        <textarea className="form-control" id="FormControlTextArea" rows={3}
                            onChange={e => setQuestion(e.target.value)} value={question}>
                        </textarea>
                    </div>
                    <div>
                        <button type="button" className="btn btn-primary mt-3" onClick={submitNewQuestion}>
                            Submit Question
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function requestOptions(url: string, requestOptions: any) {
    throw new Error("Function not implemented.");
}
