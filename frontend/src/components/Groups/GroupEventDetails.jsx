import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./GroupEventDetails.css";

function GroupEventDetails() {
    const navigate = useNavigate();
    const groupEvents = useSelector((state) => Object.values(state.groups.currGroupEvents));

    const todayDate = new Date();


    const upcomingEvents = groupEvents.filter((event) => new Date(event.startDate) > todayDate);

    const previousEvents = groupEvents.filter((event) => new Date(event.startDate) < todayDate);


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
        <>
            <section>
                {groupEvents.length === 0 ? (<h1>No Upcoming Events</h1>) : null}
            </section>
            <section className="upcomingSection">
                {upcomingEvents.length > 0 ? (
                    <section className="events">
                        <h3>Upcoming Events {`(${upcomingEvents.length})`} </h3>
                        {upcomingEvents.map((event) => (
                            <div className="component" key={event.id} onClick={() => navigate(`/events/${event.id}`)}>
                                <div className="imgDetails">
                                    <img className="eventDetailsImg" src={event.previewImage} />
                                    <div className="eventDetailsB">
                                        <p> {event.startDate} • {convertTime(event.startDate)}</p>
                                        <p> {event.name} </p>
                                        <p> {!event.Venue ? null : event.Venue.city}, {!event.Venue ? null : event.Venue.state} </p>
                                    </div>
                                </div>
                                <p> {event.description} </p>
                            </div>
                        ))}
                    </section>
                ) : null}
            </section>
            <section className="previousSec">
                {previousEvents.length > 0 ? (
                    <section className="events">
                        <h3>Previous Events {`(${previousEvents.length})`} </h3>
                        {previousEvents.map((event) => (
                            <div className="component" key={event.id} onClick={() => navigate(`/events/${event.id}`)}>
                                <div className="imgDetails">
                                    <img className="eventDetailsImg" src={event.previewImage} />
                                    <div className="eventDetailsB">
                                        <p> {event.startDate} • {convertTime(event.startDate)}</p>
                                        <p> {event.name} </p>
                                        <p> {!event.Venue ? null : event.Venue.city}, {!event.Venue ? null : event.Venue.state} </p>
                                    </div>
                                </div>
                                <p> {event.description} </p>
                            </div>
                        ))}
                    </section>
                ) : null}
            </section >
        </>
    )
}


export default GroupEventDetails;
