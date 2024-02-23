import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllEvents } from "../../store/events";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./AllEvents.css"


function AllEvents() {
    const dispatch = useDispatch();
    const events = useSelector((state) => Object.values(state.events.allEvents));
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchAllEvents())
    }, [dispatch])

    let eventCompInfo = events?.map((event) => {
        const eventDate = new Date(event?.startDate);

        return (
            <div className="EventComponentSection" key={event?.id} onClick={() => {
                const url = `/events/${event?.id}`
                navigate(url)
            }}>
                <div className="EventWholeComponent">
                    <div className="EventComponent" key={event?.id} onClick={() => {
                        const url = `/events/${event?.id}`
                        navigate(url)
                    }}>
                        <img className="EventImg" src={event?.previewImage} />
                        <div className="EventDetails">
                            <p> {eventDate.toLocaleDateString()} • {eventDate.toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true
                            })} </p>
                            <h2> {event?.name}</h2>
                            <p> {event?.Venue?.city}, {event?.Venue?.state} </p>
                        </div>
                    </div>
                    <div className="EventDescription">
                        <p>{event?.description}</p>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="allEventsRoot">
            <section className="EventHeader">
                <div className="EventHeaderLinks">
                    <NavLink to="/groups" style={({ isActive }) => ({
                        color: isActive ? "teal" : "grey",
                        textDecoration: isActive ? "underline" : "none"
                    })}>Worlds</NavLink>
                    <NavLink to="/events" style={({ isActive }) => ({
                        color: isActive ? "teal" : "grey",
                        textDecoration: isActive ? "underline" : "none"
                    })}>Events</NavLink>
                </div>
            </section>
            <div className="EventHeaderCaption">
                <p className="EventHeaderCaptionText"> <span style={{ fontWeight: "bold" }}>Events</span> at The Cartoon Social Network</p>
            </div>
            {eventCompInfo}
            <div className="LandButton">
            </div>
        </div>
    )
}

export default AllEvents;
