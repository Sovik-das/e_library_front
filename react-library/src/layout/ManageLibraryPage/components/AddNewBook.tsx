import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import AddBookRequest from "../../../models/AddBookRequest";

export const AddNewBook = () =>{
    const {authState} = useOktaAuth();
    //New Book
    const [title,setTitle] = useState('');
    const [category,setCategory] = useState('Category');
    const [author,setAuthor] = useState('');
    const [copies,setCopies] = useState(0);
    const [selectedImage,setSelectedImage] = useState<any>(null);
    const [description,setDescription] = useState('');

    //Displays
    const[displayWarnings,setDisplayWarnings] = useState(false);
    const[displaySuccess,setDisplaySuccess] = useState(false);
    function categoryField(value:string){
        setCategory(value);
    }
    async function base64ConversionForImages(e:any){
        if(e.target.files[0]){
            getbase64(e.target.files[0]);

        }
    }
    function getbase64(file:any){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (){
            setSelectedImage(reader.result);
        };
        reader.onerror = function(error){
            console.log('Error',error);
        }
    }
    async function AddNewBook(){
        const url = `${process.env.REACT_APP_API}/admin/secure/add/book`;
        if(authState?.isAuthenticated && title!=='' && category!=='Category' && description!==''
        && copies>=0 && author!==''){
            const book:AddBookRequest = new AddBookRequest(title,copies,description,selectedImage,category,author);
            const requestOptions = {
                method:'POST',
                headers:{
                    Authorization:`bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(book)
            };
            const submitResponse = await fetch(url,requestOptions);
            if(!submitResponse.ok){
                throw new Error('Something went wrong!!');
            }
            setTitle('');
            setAuthor('');
            setDescription('');
            setCopies(0);
            setCategory('Category');
            setSelectedImage(null);
            setDisplaySuccess(true);
            setDisplayWarnings(false);
        }else{
            setDisplayWarnings(true);
            setDisplaySuccess(false);
        }
    }
    return (
        <div className="container mt-5 mb-5">
            {displaySuccess &&
                <div className="alert alert-success" role="alert">
                    Book added successfully
                </div>
            }
            {displayWarnings && 
                <div className="alert alert-danger" role="alert">
                    All fields must be filled out 
                </div>
            }
            <div className="card">
                <div className="card-header">
                    Add a new book
                </div>
                <div className="card-body">
                    <form method="POST">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Title
                                </label>
                                <input type="text" className="form-control" name="title" required
                                onChange={e=>setTitle(e.target.value)} value={title}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">
                                    Author
                                </label>
                                <input type="text" className="form-control" name="title" required
                                onChange={e=>setAuthor(e.target.value)} value={author}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">
                                    Category
                                </label>
                                <button className="form-control btn btn-secondary dropdown-toggle" type="button" 
                                id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    {category}
                                </button>
                                <ul id="addNewBookId" className="dropdown-menu" aria-aria-labelledby="dropdownMenuButton1">
                                    <li>
                                        <a onClick={() => categoryField('FE')} className="dropdown-item">
                                            Front End
                                        </a>
                                        
                                    </li>
                                    <li>
                                        <a onClick={() => categoryField('BE')} className="dropdown-item">
                                            Back End
                                        </a>
                                        
                                    </li>
                                    <li>
                                        <a onClick={() => categoryField('Data')} className="dropdown-item">
                                           Data
                                        </a>
                                        
                                    </li>
                                    <li>
                                        <a onClick={() => categoryField('DevOps')} className="dropdown-item">
                                        DevOps
                                        </a>
                                        
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-12 mb-3">
                            <label className="form-label">
                                Description
                            </label>
                            <textarea className="form-control" id="exampleFormControlTextarea1" rows={3}
                            onChange={e=>setDescription(e.target.value)} value={description}
                            >

                            </textarea>
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label" >
                                Copies
                            </label>
                            <input type="number" className="form-control" name="Copies" required
                            onChange={e=>setCopies(Number(e.target.value))} value={copies}/>
                        </div>
                        <input type="file" onChange={e=>base64ConversionForImages(e)}/>
                        <div>
                            <button type="button" className="btn btn-primary mt-3" onClick={AddNewBook}>
                            Add Book
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}