import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { Link, useNavigate } from 'react-router-dom';
import "./ProfileButton.css";
import { FaUserCircle } from "react-icons/fa";


function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    navigate('/')
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className='modalButton' onClick={toggleMenu}>
        <FaUserCircle size={60} color='#c2edf9' />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div style={{ display: 'flex', textAlign: "center", padding: "10px" }}>
            <div className='profileComponents'>
              <div>Hello {user.firstName}!</div>
              <div>{user.firstName} {user.lastName}</div>
              <div>{user.email}</div>
            </div>
            <div className='profileComponents'>
              <div><Link className='easyLinks' to="/groups">View Worlds</Link></div>
              <div><Link className='easyLinks' to='/events'>View Events</Link> </div>
              <div><Link className='easyLinks' to='/groups/new'>Create A World</Link></div>
              <button className='logOutButton' onClick={logout}>Log Out</button>
            </div>
            <>
            </>
          </div>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
