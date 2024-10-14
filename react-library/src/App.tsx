
import { Redirect, Route, Switch,useHistory } from 'react-router-dom';
import './App.css';
import { BookCheckOutPage } from './layout/BookCheckOutPage/BookCheckOutPage';
import { HomePage } from './layout/HomePage/HomePage';
import { Footer } from './layout/NavbarAndFooter/Footer';
import { Navbar } from './layout/NavbarAndFooter/Navbar';
import { SearchBooksPage } from './layout/SearchBooksPage/SearchBooksPage';
import { oktaConfig } from './lib/oktaConfig';
import BookModel from './models/BookModel';
import  {OktaAuth,toRelativeUrl} from '@okta/okta-auth-js';
import { SecureRoute, Security } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';
import { LoginCallback } from '@okta/okta-react';
import { ReviewListPage } from './layout/BookCheckOutPage/ReviewListPage/ReviewListPage';
import { ShelfPage } from './layout/ShelfPage/ShelfPage';
import { MessagesPage } from './layout/Message/MessagesPage';
import { ManageLibraryPage } from './layout/ManageLibraryPage/ManageLibraryPage';
import { PaymentPage } from './layout/PaymentPage/PaymentPage';

const oktaAuth = new OktaAuth(oktaConfig);
export const App = () => {
  const customAuthHandler = () =>{
    history.push('/login');
  }
  const history = useHistory();
  const restoreOriginalUri = async(_oktaAuth:any,originalUri:any) =>{
    history.replace(toRelativeUrl(originalUri || '/',window.location.origin))
  } 
  return (
    <div className='d-flex flex-column min-vh-100'>
      
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
      <div className='flex-grow-1'>
      <Navbar/>
      <Switch>
      <Route path="/" exact>
        <Redirect to="/home"/>
      </Route>
      <Route path="/home">
        <HomePage/>
      </Route>
      <Route path="/search">
        <SearchBooksPage/>
      </Route>
      <Route path="/reviewlist/:bookId">
        <ReviewListPage/>
      </Route>
      <Route path="/checkout/:bookId">
        <BookCheckOutPage/>
      </Route>
      <Route path='/login' render={()=><LoginWidget config={oktaConfig}/>}/>
      <Route path='/login/callback' component={LoginCallback}/>
      <SecureRoute path='/shelf'>
        <ShelfPage/>
      </SecureRoute>
      <SecureRoute path="/messages">
        <MessagesPage/>
      </SecureRoute>
      <SecureRoute path="/admin">
        <ManageLibraryPage/>
      </SecureRoute>
      <SecureRoute path="/fees">
        <PaymentPage/>
      </SecureRoute>
      </Switch>
      </div>
      <Footer/>
      </Security>
      
    </div>
    
  );
}


