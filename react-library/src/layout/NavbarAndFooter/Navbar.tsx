import { useOktaAuth } from "@okta/okta-react";
import { Link,NavLink } from "react-router-dom";
import { SpinnerLoading } from "../Utils/SpinnerLoading";

export const Navbar = () => {
  const { oktaAuth, authState } = useOktaAuth();
  if (!authState) {
    return <SpinnerLoading />
  }
  const handlelogout = async () => oktaAuth.signOut();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark main-color py-3">
      <div className="container-fluid">
        <span className="navbar-brand">e-Library</span>
        <button className="navbar-toggler" type="button" data-bs-target="#navbarNavDropdown" data-bs-toggle="collapse"
          arial-control="navbarNavDropdown" arial-expanded="false" arial-label="Toggle Navigation"
        >
          <span className='navbar-toggler-icon'></span>
        </button>


        <div className='collapse navbar-collapse' id='navbarNavDropdown'>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <NavLink className='nav-link' to="/home">Home</NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className='nav-link' to="/search">Search Book</NavLink>
            </li>
            {authState.isAuthenticated &&
              <li className='nav-item'>
              <NavLink className='nav-link' to="/shelf">Shelf</NavLink>
            </li>
            }
             {authState.isAuthenticated &&
              <li className='nav-item'>
              <NavLink className='nav-link' to="/fees">Pay fees</NavLink>
            </li>
            }
            {authState.isAuthenticated && authState.accessToken?.claims?.userType==='admin' &&
              <li className='nav-item'>
                <NavLink className='nav-link' to="/admin">Admin</NavLink>
              </li>
            }
          </ul>
          <ul className='navbar-nav ms-auto'>
            {!authState.isAuthenticated ?
              <li className='nav-item m-1'>
                <Link type="button" className='btn btn-outline-light' to="/login">Sign in</Link>
              </li>
              :
              <li>
                <button className="btn btn-outline-light" onClick={handlelogout}>Logout</button>
              </li>
            }


          </ul>
        </div>
      </div>
    </nav>
  );
}