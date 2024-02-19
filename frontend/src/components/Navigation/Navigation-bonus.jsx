import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';
import logo from '../../images/logo.png'
import LoginFormModal from '../LoginFormModal';
import OpenModalButton from '../OpenModalButton';
import SignupFormModal from '../SignupFormModal';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  const sessionLinks = sessionUser ?
    (
      <>
        <ProfileButton user={sessionUser} />
      </>
    ) : (
      <>
        <div>
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
          {/* <NavLink to="/login">Log In</NavLink> */}
        </div>
        <div>
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
          {/* <NavLink to="/signup">Sign Up</NavLink> */}
        </div>
      </>
    );

  return (
    <div className='NavBarLinks'>
      <NavLink to="/" className='navLogo' >
        <div className='navLogoText'>
          <h1 className='logoText' style={{ color: "white", paddingRight: '30px' }}>THE</h1>
          <img src={logo} alt='CN Network Logo'></img>
          <h1 className='logoText' style={{ color: "white" }}>NETWORK</h1>
        </div>
      </NavLink>
      <div className='NavBarButtons'>
        {isLoaded && sessionLinks}
      </div>
    </div>
  );
}

export default Navigation;
