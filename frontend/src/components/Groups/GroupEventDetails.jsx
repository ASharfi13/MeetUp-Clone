import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

function GroupEventDetails() {
    const dispatch = useDispatch();
    const groupEvents = useSelector((state) => Object.values(state.groups.currGroupEvents));

    const todayDate = new Date();


    const upcomingEvents = groupEvents.filter((event) => event.startDate > todayDate.toDateString());

    const previousEvents = groupEvents.filter((event) => event.startDate < todayDate.toDateString());


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
            <section className="upcomingSection">
                {upcomingEvents.length > 0 ? (
                    <section className="events">
                        {upcomingEvents.map((event) => (
                            <div className="upcoming" key={event.id}>
                                <h3>Upcoming Events {`(${upcomingEvents.length})`} </h3>
                                <div className="img/details">
                                    <img src={event.previewImage} />
                                    <div>
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
                        {previousEvents.map((event) => (
                            <div className="upcoming" key={event.id}>
                                <h3>Previous Events {`(${previousEvents.length})`} </h3>
                                <div className="img/details">
                                    <img src={event.previewImage} />
                                    <div>
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
        </>
    )
}


export default GroupEventDetails;
