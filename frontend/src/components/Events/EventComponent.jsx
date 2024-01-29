import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllEvents, fetchEvent, fetchDeleteEvent } from "../../store/events";
import { fetchGroupComp } from "../../store/groups";
import "./EventComponent.css";

function EventComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { eventId } = useParams();
    const [permission, setPermission] = useState(false);

    const event = useSelector(state => state.events.currEvent);
    const group = useSelector(state => state.groups.currGroup);
    const user = useSelector(state => state.session.user);

    let groupId;

    !event.Group || (
        groupId = event.Group.id
    )


    const convertTime = (date) => {
        const newDate = new Date(date);

        const time = newDate.toLocaleTimeString('en-US', {
            hour: "numeric",
            minute: "numeric",
            hour12: true
        })

        return time;
    }


    useEffect(() => {
        dispatch(fetchAllEvents())
        dispatch(fetchEvent(Number(eventId)))
        dispatch(fetchGroupComp(groupId))

        if (user?.id && group.organizerId) setPermission(Number(user.id) === Number(group.organizerId))
    }, [dispatch, eventId, groupId, user?.id, group.organizerId, setPermission])

    const handleDeleteEvent = () => {
        dispatch(fetchDeleteEvent(eventId)).then(() => {
            navigate(`/groups/${groupId}`);
        })
    }

    return (
        <>
            <p> {`<`} <Link className="eventBread" to="/events">Events</Link></p>
            <h1> {event.name} </h1>
            <p>Hosted by {!group.Organizer ? null : group.Organizer.firstName} {!group.Organizer ? null : group.Organizer.lastName}</p>
            <section className="MainEventContent">
                <img className="eventCompImage" src={!event.EventImages ? null : event.EventImages[0].url} />
                <div className="theSidePieces">
                    <div className="eventGroupComp">
                        <img className="groupEventCompEvent" src={!group.GroupImages ? null : group.GroupImages[0].url} />
                        <div>
                            <p> {group.name} </p>
                            <p> {group.private ? "Private" : "Public"} </p>
                        </div>
                    </div>
                    <div className="theTimeStuff">
                        <p><i className="fa-regular fa-clock"></i>START {event.startDate} • {convertTime(event.startDate)}</p>
                        <p><i className="fa-regular fa-clock"></i>END {event.endDate} • {convertTime(event.endDate)}</p>
                        <p> <i className="fa-solid fa-dollar-sign"></i> {event.price === 0 ? "FREE" : event.price} </p>
                        <p> <i className="fa-solid fa-location-pin"></i> {event.type} </p>
                        {permission && user ? (<p> {event.type} <button className="eventButton" onClick={navigate(`/events/${eventId}/edit`)}>Update</button>  <button className="eventButton" onClick={e => {
                            if (window.confirm('Are you sure you want to delete this event?')) {
                                handleDeleteEvent();
                            }
                        }}>Delete</button> </p>) : null}
                    </div>
                </div>
            </section>
            <section className="EventDetails">
                <h3>Details</h3>
                <p>
                    {event.description}
                </p>
            </section>
        </>
    )
}

export default EventComponent;
