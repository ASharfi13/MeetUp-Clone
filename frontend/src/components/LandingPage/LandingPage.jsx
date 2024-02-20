import "./LandingPage.css"
import { Link } from "react-router-dom";
import cartoon from "../../images/cartoon.png"
import avatar from "../../images/avatar.png"
import regularshow from "../../images/regularshow.png"
import ben10 from "../../images/ben10.png"
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";
import { useSelector } from 'react-redux';
import { useState } from "react";


function LandingPage() {
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);

    const openSignUpModal = () => {
        setIsSignUpOpen(true);
    }

    const closeSignUpModel = () => {
        setIsSignUpOpen(false)
    }

    const user = useSelector(state => state.session.user);


    return (
        <>
            <div className="LandingMainTextImg">
                <h1 className="landingText">
                    Welcome To The Cartoon Social Network! The Ultimate Cartoon Social Space where you can meet and share space with your favorite cartoon characters!
                </h1>
                <h1 className="landingImg">
                    <img src={cartoon} alt="Cartoon Network Characters"></img>
                </h1>
            </div>
            <div className="LandingHowItWorks">
                <h2>New at The Cartoon Social Network?</h2>
                <h4 className="howItWorksText">Sign up and find Cartoon Worlds & Cartoon Events that will take you to magical world where you will have fun with your favorite cartoon characters from your childhood!</h4>
            </div>
            <div className="LandingSubLinks">
                <div className="SubLink">
                    <img className="linkImage" src={avatar} alt="Avatar Worlds Logo"></img>
                    <Link className="linkText" to="/groups">See All Worlds</Link>
                    <p>Whether you{'\''}re an Air-Bender! A talking blue Cat with a Goldfish friend! Or the Grim Reaper! Come find the Cartoon World you want to explore!</p>
                </div>
                <div className="SubLink">
                    <img className="linkImage" src={regularshow} alt="Regular Show Events logo"></img>
                    <Link className="linkText" to='/events'>Find An Event</Link>
                    <p>Down for a one on one in Mystical Basketball? An Adventure across the Land of Ooo? A lab party at Dexter{'\''}s? Click and Search through more Awesome Events!</p>
                </div>
                <div className="SubLink">
                    <img className="linkImage" src={ben10} alt="Gumball Start Logo"></img>
                    {user !== null ? (<Link className="linkText" to={'/groups/new'} >Start A World</Link>) : (<h1 style={{ fontWeight: 400, color: 'grey' }}>Start A World</h1>)}
                    <p>Everyone loves a good crossover! Have you ever imagined Gumball, Finn, and Ben10 launching an epic battle against Vilgax! Click and Create that World Now!</p>
                </div>
            </div>
            <div className="LandButton">
                {!user ? <OpenModalButton
                    buttonText={'Join CN Network'}
                    modalComponent={<SignupFormModal closeModel={closeSignUpModel} />}
                    isOpen={isSignUpOpen}
                    openModal={openSignUpModal}
                    closeModel={closeSignUpModel}
                /> : null}
            </div>
        </>
    )
}


export default LandingPage;
