import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEvent } from "../../store/events";
import { fetchGroupComp } from "../../store/groups";


function EventComponent() {
    const dispatch = useDispatch();
    const { eventId } = useParams();

    const event = useSelector(state => state.events.currEvent);
    const group = useSelector(state => state.groups.currGroup);

    let groupId;

    !event.Group || (
        groupId = event.Group.id
    )


    console.log(event);
    console.log("GROUP", group);

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
        dispatch(fetchEvent(Number(eventId)))
        dispatch(fetchGroupComp(groupId))
    }, [dispatch, eventId, groupId])

    return (
        <>
            <p> {`<`} <Link to="/events">Events</Link></p>
            <section className="EventDetailHeader">
                <h1> {event.name} </h1>
                <p>Hosted by {!group.Organizer ? null : group.Organizer.firstName} {!group.Organizer ? null : group.Organizer.lastName}</p>
            </section>
            <section className="MainEventContent">
                <img src={!event.EventImages ? null : event.EventImages[0].url} />
                <div>
                    <div>
                        <img src={!group.GroupImages ? null : group.GroupImages[0].url} />
                        <div>
                            <p> {group.name} </p>
                            <p> {group.private ? "Private" : "Public"} </p>
                        </div>
                    </div>
                    <div>
                        <p>Start {event.startDate} • {convertTime(event.startDate)}</p>
                        <p>End {event.endDate} • {convertTime(event.endDate)}</p>
                        <p> ${event.price} </p>
                        <p> {event.type} </p>
                    </div>
                </div>
            </section>
            <section className="EventDetails">
                <p>
                    {event.description}
                </p>
            </section>
        </>
    )
}

export default EventComponent;
