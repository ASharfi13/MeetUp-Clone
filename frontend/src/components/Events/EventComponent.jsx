import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllEvents, fetchEvent, fetchDeleteEvent } from "../../store/events";
import { fetchGroupComp } from "../../store/groups";
import { GoClockFill } from "react-icons/go";
import { FaSackDollar } from "react-icons/fa6";
import { FaMapPin } from "react-icons/fa";
import eventDetailsBackground from "../../images/backgrounds/landingPageBackPick.png"



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
        <div style={{ backgroundImage: `url(${eventDetailsBackground})` }} className="eventDetailsRoot">
            <div className="eventRoot">
                <div className="eventHeader">
                    <p> {`<`} <Link className="eventBread" to="/events">Events</Link></p>
                    <h1 className="eventName"> {event.name} </h1>
                    <p className="eventHostDetails">Hosted by {!group.Organizer ? null : group.Organizer.firstName} {!group.Organizer ? null : group.Organizer.lastName}</p>
                </div>
                <section className="MainEventContent">
                    <img style={{ maxHeight: '1000px', maxWidth: '580px', minWidth: '580px', marginRight: '10px' }} className="eventCompImage" src={!event.EventImages ? null : event.EventImages[0].url} />
                    <div className="theSidePieces">
                        <div className="eventGroupComp">
                            <div className="groupDetails">
                                <img className="groupEventCompEvent" src={!group.GroupImages ? null : group.GroupImages[0].url} />
                                <div>
                                    <p style={{ fontWeight: 'bold' }}> {group.name} </p>
                                    <p style={{ fontStyle: "italic", fontSize: "20px" }}> {group.private ? "Private" : "Public"} </p>
                                </div>
                            </div>
                        </div>
                        <div className="eventTimeComp">
                            <div className="specificDetails">
                                <GoClockFill color="#0080FF" size={40} className="icons" />
                                <div className="eventStartEndDates">
                                    <p> <span className="StartEnd">START</span> <span>{event.startDate ? event.startDate.split('T')[0] : null} • {event.startDate ? new Date(event.startDate).toLocaleTimeString("en-US", {
                                        hour: 'numeric', minute: 'numeric', hour12: true
                                    }) : null}</span></p>
                                    <p> <span className="StartEnd">END</span> <span>{event.endDate ? event.endDate.split('T')[0] : null} • {event.endDate ? new Date(event.endDate).toLocaleTimeString('en-US', {
                                        hour: 'numeric', minute: 'numeric', hour12: true
                                    }) : null}</span></p>
                                </div>
                            </div>
                            <div className="specificDetails">
                                <FaSackDollar color="#FF007F" size={40} className="icons" />
                                <p style={{ fontSize: "30px", fontStyle: "italic" }}>{event.price === 0 ? "FREE" : `$${event.price}`}</p>
                            </div>
                            <div className="specificDetails">
                                <FaMapPin color="#FEE118" size={40} className="icons" />
                                <p style={{ fontSize: "20px" }}>{event.type}</p>
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
                    <h2 className="detailsEventBottom">Details</h2>
                    <p className="detailsEventText">
                        {event.description}
                    </p>
                </section>
            </div>
        </div>
    )
}

export default EventComponent;
