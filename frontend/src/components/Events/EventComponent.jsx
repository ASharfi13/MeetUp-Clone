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

    console.log(event);

    let groupId;

    !event.Group || (
        groupId = event.Group.id
    )


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
            <div className="eventRoot">
                <div className="eventHeader">
                    <p> {`<`} <Link className="eventBread" to="/events">Events</Link></p>
                    <h1> {event.name} </h1>
                    <p>Hosted by {!group.Organizer ? null : group.Organizer.firstName} {!group.Organizer ? null : group.Organizer.lastName}</p>
                </div>
                <section className="MainEventContent">
                    <img className="eventCompImage" src={!event.EventImages ? null : event.EventImages[0].url} />
                    <div className="theSidePieces">
                        <div className="eventGroupComp">
                            <div className="groupDetails">
                                <img className="groupEventCompEvent" src={!group.GroupImages ? null : group.GroupImages[0].url} />
                                <div>
                                    <p> {group.name} </p>
                                    <p> {group.private ? "Private" : "Public"} </p>
                                </div>
                            </div>
                        </div>
                        <div className="eventTimeComp">
                            <div className="specificDetails">
                                <i className="fa-solid fa-clock fa-2x"></i>
                                <div className="eventStartEndDates">
                                    <p>START <span>{event.startDate ? event.startDate.split('T')[0] : null} • {event.startDate ? new Date(event.startDate).toLocaleTimeString("en-US", {
                                        hour: 'numeric', minute: 'numeric', hour12: true
                                    }) : null}</span></p>
                                    <p>END <span>{event.endDate ? event.startDate.split('T')[0] : null} • {event.startDate ? new Date(event.endDate).toLocaleTimeString('en-US', {
                                        hour: 'numeric', minute: 'numeric', hour12: true
                                    }) : null}</span></p>
                                </div>
                            </div>
                            <div className="specificDetails">
                                <i className="fa-solid fa-dollar-sign fa-2x"></i>
                                <p>{event.price === 0 ? "FREE" : event.price}</p>
                            </div>
                            <div className="specificDetails">
                                <i className="fa-solid fa-map-pin fa-2x"></i>
                                <p>{event.type}</p>
                                {permission && user ? (<p className="certifiedButtons"> <button className="eventButton" onClick={() => navigate(`/events/${eventId}/edit`)}>Update</button>  <button className="eventButton" onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this event?')) {
                                        handleDeleteEvent();
                                    }
                                }}>Delete</button> </p>) : null}
                            </div>
                        </div>
                    </div>
                </section>
                <section className="eventDetails">
                    <h3>Details</h3>
                    <p>
                        {event.description}
                    </p>
                </section>
            </div>
        </>
    )
}

export default EventComponent;
