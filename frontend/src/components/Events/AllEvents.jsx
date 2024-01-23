import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllEvents } from "../../store/events";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./AllEvents.css"


function AllEvents() {
    const dispatch = useDispatch();
    const events = useSelector((state) => Object.values(state.events));
    const navigate = useNavigate();

    console.log(events);

    useEffect(() => {
        dispatch(fetchAllEvents())
    }, [dispatch])

    let eventCompInfo = events.map((event) => {
        const eventDate = new Date(event.startDate);

        return (
            <div key={event.id} onClick={() => {
                const url = `/events/${event.id}`
                navigate(url)
            }}>
                <div className="EventComponent" key={event.id} onClick={() => {
                    const url = `/events/${event.id}`
                    navigate(url)
                }}>
                    <div className="EventImg">
                        <img src={event.previewImage} />
                    </div>
                    <div className="EventDetails">
                        <h3> {event.name}</h3>
                        <p> {eventDate.toLocaleDateString()} • {eventDate.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true
                        })} </p>
                        <p> {event.Venue.city}, {event.Venue.state} </p>
                    </div>
                </div>
                <div className="EventDescription">
                    <p>{event.description}</p>
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
                    })}>Groups</NavLink>
                    <NavLink to="/events" style={({ isActive }) => ({
                        color: isActive ? "teal" : "grey",
                        textDecoration: isActive ? "underline" : "none"
                    })}>Events</NavLink>
                </div>
                <div className="EventHeaderCaption">
                    <p>Events in TheClub</p>
                </div>
            </section>
            {eventCompInfo}
        </>
    )
}

export default AllEvents;
