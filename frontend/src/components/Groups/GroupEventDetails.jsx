import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./GroupEventDetails.css";
import { useEffect } from "react";
import { fetchGroupEvents, clearGroupEvents } from "../../store/groups";
import groupDetailsBackDrop from "../../images/eventDetailsBackground.png"

function GroupEventDetails() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { groupId } = useParams();

    useEffect(() => {
        dispatch(fetchGroupEvents(Number(groupId)))

        return () => {
            dispatch(clearGroupEvents({}));
        }
    }, [dispatch, groupId])

    //////////

    const groupEvents = useSelector((state) => Object.values(state.groups.currGroupEvents));

    const todayDate = new Date();

    const upcomingEvents = groupEvents ? groupEvents.filter((event) => new Date(event?.startDate) > todayDate) : [];

    const previousEvents = groupEvents ? groupEvents.filter((event) => new Date(event?.startDate) < todayDate) : [];

    ////////


    const convertTime = (date) => {
        const newDate = new Date(date);

        const time = newDate.toLocaleTimeString('en-US', {
            hour: "numeric",
            minute: "numeric",
            hour12: true
        })

        return time;
    }

    return (
        <div style={{ backgroundImage: `url(${groupDetailsBackDrop})` }} className="AllEvents">
            {upcomingEvents.length > 0 && (
                <section className="upcomingSection">
                    <section className="events">
                        <h3 style={{ color: "white" }}>Upcoming Events {`(${upcomingEvents?.length})`} </h3>
                        {upcomingEvents?.map((event) => (
                            <div style={{ boxShadow: "10px 10px #1889F2" }} className="component" key={event?.id} onClick={() => navigate(`/events/${event?.id}`)}>
                                <div className="imgDetails">
                                    <img className="eventDetailsImg" src={event?.previewImage} />
                                    <div className="eventDetailsB">
                                        <p> {event?.startDate.split("T")[0]} • {convertTime(event?.startDate)}</p>
                                        <p style={{ fontSize: "20px", fontWeight: "bold" }}> {event?.name} </p>
                                        <p> {!event?.Venue ? null : event.Venue.city}, {!event.Venue ? null : event.Venue.state} </p>
                                    </div>
                                </div>
                                <p> {event?.description} </p>
                            </div>
                        ))}
                    </section>
                </section>
            )}
            {previousEvents?.length > 0 && (
                <section className="previousSec">
                    <section className="events">
                        <h3 style={{ color: "white" }}>Previous Events {`(${previousEvents?.length})`} </h3>
                        {previousEvents?.map((event) => (
                            <div style={{ boxShadow: "10px 10px #1889F2" }} className="component" key={event?.id} onClick={() => navigate(`/events/${event?.id}`)}>
                                <div className="imgDetails">
                                    <img className="eventDetailsImg" src={event?.previewImage} />
                                    <div className="eventDetailsB">
                                        <p> {event?.startDate.split("T")[0]} • {convertTime(event?.startDate)}</p>
                                        <p style={{ fontSize: "20px", fontWeight: "bold" }} > {event?.name} </p>
                                        <p> {!event.Venue ? null : event.Venue.city}, {!event.Venue ? null : event.Venue.state} </p>
                                    </div>
                                </div>
                                <p> {event?.description} </p>
                            </div>
                        ))}
                    </section>
                </section >
            )}
        </div>
    )
}


export default GroupEventDetails;
