import { useParams, useNavigate, Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGroupComp, fetchGroupEvents } from "../../store/groups";
import GroupEventDetails from "./GroupEventDetails";



function GroupComponent() {

    const { groupId } = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups.currGroup);
    const navigate = useNavigate();
    const user = useSelector(state => state.session.user);
    const [permission, setPermission] = useState(false);

    console.log("User", user);

    let url;

    let Organizer = {
        firstName: null,
        lastName: null
    }

    if (!group.GroupImages || group.GroupImages.length === 0) {
        url = null
    } else {
        url = group.GroupImages[0].url
    }

    !group.Organizer || (
        Organizer.firstName = group.Organizer.firstName,
        Organizer.lastName = group.Organizer.lastName
    )

    const todayDate = new Date();

    useEffect(() => {
        dispatch(fetchGroupComp(Number(groupId)));
        dispatch(fetchGroupEvents(Number(groupId)));

        setPermission(Number(user.id) === Number(group.organizerId))
    }, [dispatch, groupId, user.id, group.organizerId])

    console.log("Group", group);

    return (
        <>
            <main>
                <Link to='/groups'>{`<`}Groups</Link>
                <section className="UpperMain">
                    <div>
                        <img src={url} />
                    </div>
                    <section className="GroupDetails">
                        <div>
                            <div>
                                <h4> {group.name} </h4>
                                <p> {group.city}, {group.state} </p>
                                <p> {group.numEvents} Events • {group.private ? "Private" : "Public"}</p>
                                <p> Organized by {Organizer.firstName} {Organizer.lastName}</p>
                            </div>
                            {permission ? (<div>
                                <button onClick={e => navigate(`/groups/${groupId}/events/new`)}>Create Event</button>
                                <button onClick={e => navigate(`/groups/${groupId}/edit`)}>Update</button>
                            </div>) : null}
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
