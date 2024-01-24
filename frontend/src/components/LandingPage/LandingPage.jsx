import "./LandingPage.css"
import AllGroups from "../Groups/AllGroups";
import { Link } from "react-router-dom";

function LandingPage() {

    return (
        <>
            <div className="LandingMainTextImg">
                <h1 className="MainElements">
                    The Ultimate People-Meeting Platform - turn your interests into life-long friendships.
                </h1>
                <h1 className="MainElements">
                    img goes here
                </h1>
            </div>
            <div className="LandingHowItWorks">
                <h2 className="HowitWorksElements">New at TheClub?</h2>
                <p className="HowitWorksElements">Sign up and have the chance to find Groups & Events that align exactly with what YOU love to do! Find your Club!</p>
            </div>
            <div className="LandingSubLinks">
                <div className="SubLink">
                    <h3>See All Groups Img</h3>
                    <Link to="/groups">See All Groups</Link>
                    <p>Find people who share your interests! Click and find your Group!</p>
                </div>
                <div className="SubLink">
                    <h3>Find An Event Img</h3>
                    <h3 style={{ color: "red" }}>Find An Event Link</h3>
                    <p>Do you love to scuba dive? Play Jazz on Piano? Hike? We got it all! Click and register now!</p>
                </div>
                <div className="SubLink">
                    <h3>Start A New Group Img</h3>
                    <Link to="/groups/new">Start A New Group</Link>
                    <p>Be a Trailblazer! Start your own Group and invite all your friends! Click and create now!</p>
                </div>
            </div>
            <div className="LandButton">
                <button className="button">Join TheClub</button>
            </div>
        </>
    )
}


export default LandingPage;
