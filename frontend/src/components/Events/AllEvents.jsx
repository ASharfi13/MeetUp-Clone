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
                        <h3> {event?.name}</h3>
                        <p> {event?.Venue?.city}, {event?.Venue?.state} </p>
                    </div>
                </div>
                <div className="EventDescription">
                    <p>{event?.description}</p>
                </div>
            </div>
        )
    })

    return (
        <>
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
                <div className="EventHeaderCaption">
                    <p> <span style={{ fontWeight: "bold" }}>Events</span> at The Cartoon Social Network</p>
                </div>
            </section>
            {eventCompInfo}
        </>
    )
}

export default AllEvents;
