import { useParams, useNavigate, Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllGroups, fetchDeleteGroup, fetchGroupComp, fetchGroupEvents } from "../../store/groups";
import GroupEventDetails from "./GroupEventDetails";
import "./GroupComponent.css";



function GroupComponent() {

    const { groupId } = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups.currGroup);
    const navigate = useNavigate();
    const user = useSelector(state => state.session.user);
    const [permission, setPermission] = useState(false);
    const groups = useSelector((state) => Object.values(state.groups.allGroups));

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
        dispatch(fetchAllGroups());

        if (user?.id && group.organizerId) setPermission(Number(user.id) === Number(group.organizerId))
    }, [dispatch, groupId, user?.id, group.organizerId, setPermission])

    const handleDeleteConfirm = () => {
        dispatch(fetchDeleteGroup(groupId)).then(() => {
            navigate(`/groups`);
        })
    }


    return (
        <>
            <main>
                <Link className="breadLink" to='/groups'>{`<`}Worlds</Link>
                <section className="UpperMain">
                    <img className="groupImg" src={url} />
                    <section className="GroupDetails">
                        <div>
                            <div>
                                <h4> {group.name} </h4>
                                <p> {group.city}, {group.state} </p>
                                <p> Events {`(${group.numEvents})`} • {group.private === true ? "Private" : "Public"}</p>
                                <p> Organized by {Organizer.firstName} {Organizer.lastName}</p>
                            </div>
                            <div className="groupButtons">
                                {user?.id !== group.organizerId && user ? (
                                    <button style={{ backgroundColor: 'red' }} className="singleButton" onClick={e => alert("Feature Coming Soon!")}>Join Group</button>)
                                    : null}
                                {permission ? (<>
                                    <button className="singleButton" onClick={e => navigate(`/groups/${groupId}/events/new`)}>Create Event</button>
                                    <button className="singleButton" onClick={e => navigate(`/groups/${groupId}/edit`)}>Update</button>
                                    <button className="singleButton" onClick={e => {
                                        if (window.confirm('Are you sure you want to delete this group?')) {
                                            handleDeleteConfirm();
                                        }
                                    }}>Delete</button>
                                </>) : (<button className="singleButton" onClick={e => navigate(`/`)}>Update</button>)}
                            </div>
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
