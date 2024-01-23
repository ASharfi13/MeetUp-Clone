import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGroupComp, fetchGroupEvents } from "../../store/groups";
import GroupEventDetails from "./GroupEventDetails";



function GroupComponent() {

    const { groupId } = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups.currGroup);

    let url;

    let Organizer = {
        firstName: null,
        lastName: null
    }

    !group.GroupImages ? url = null : url = group.GroupImages[0].url;
    !group.Organizer || (
        Organizer.firstName = group.Organizer.firstName,
        Organizer.lastName = group.Organizer.lastName
    )

    const todayDate = new Date();

    useEffect(() => {
        dispatch(fetchGroupComp(Number(groupId)));
        dispatch(fetchGroupEvents(Number(groupId)));
    }, [dispatch, groupId])

    return (
        <>
            <main>
                <section className="UpperMain">
                    <div>
                        <img src={url} />
                    </div>
                    <section className="GroupDetails">
                        <div>
                            <h4> {group.name} </h4>
                            <p> {group.city}, {group.state} </p>
                            <p> {group.numEvents} Events • {group.private ? "Private" : "Public"}</p>
                            <p> Organized by {Organizer.firstName} {Organizer.lastName}</p>
                        </div>
                        <div>
                            <button>Join Group</button>
                        </div>
                    </section>
                </section>
                <section className="LowerMain">
                    <div className="OrganizerAboutSec">
                        <h3>Organizer</h3>
                        <p> {Organizer.firstName} {Organizer.lastName} </p>
                        <h3>What we're about</h3>
                        <p> {group.about} </p>
                    </div>
                    <div className="UpcomingEvents">
                        <GroupEventDetails />
                    </div>
                </section>
            </main>
        </>
    )
}

export default GroupComponent;
