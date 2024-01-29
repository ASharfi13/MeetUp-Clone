import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';
import logo from '../../../public/images/logo.png'

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='NavBarLinks'>
      <NavLink to="/" className='navLogo' >
        <div className='navLogoText'>
          <img src={logo} alt='CN Network Logo'></img>
          <h1 className='logoText' style={{ color: "white" }}>NETWORK</h1>
        </div>
      </NavLink>

      {isLoaded && (
        <div className='profileButton'>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  );
}

export default Navigation;
