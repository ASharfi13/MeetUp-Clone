import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDeleteGroup, fetchGroupComp } from "../../store/groups";
import GroupEventDetails from "./GroupEventDetails";
import "./GroupComponent.css";



function GroupComponent() {

    const { groupId } = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups.currGroup);
    const navigate = useNavigate();
    const user = useSelector(state => state.session.user);
    const [permission, setPermission] = useState(false);

    const groupEvents = useSelector(state => state.groups.currGroupEvents);

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

    let backgroundImgUrl;

    group.backgroundImg ? backgroundImgUrl = group.backgroundImg : null;

    console.log(backgroundImgUrl);


    useEffect(() => {
        dispatch(fetchGroupComp(Number(groupId)));
        if (user?.id && group.organizerId) setPermission(Number(user.id) === Number(group.organizerId))
    }, [dispatch, groupId, user?.id, group.organizerId, setPermission])

    ////////

    const handleDeleteConfirm = () => {
        dispatch(fetchDeleteGroup(groupId)).then(() => {
            navigate(`/groups`);
        })
    }

    console.log("GroupEvents", groupEvents);

    console.log("Group", group)


    return (
        <>
            <main>
                <div style={{
                    backgroundImage: `url(${backgroundImgUrl})`,
                    backgroundSize: "cover",
                    width: "100%",
                    height: "100%"
                }} className="EntireUpperHalf">
                    <Link className="breadLink" to='/groups'>{`<`}Worlds</Link>
                    <section className="UpperMain">
                        <img className="groupImg" src={url} />
                        <section className="GroupDetails">
                            <div className="GroupDetailsButtons">
                                <div className="innerGDetails">
                                    <h4> {group.name} </h4>
                                    <p> {group.city}, {group.state} </p>
                                    <p> Events {`(${group.numEvents})`} • {group.private === true ? "Private" : "Public"}</p>
                                    <p> Organized by {Organizer.firstName} {Organizer.lastName}</p>
                                </div>
                                <div className="groupButtons">
                                    {user?.id !== group.organizerId && user ? (
                                        <button className="singleButton" onClick={() => alert("Feature Coming Soon!")}>Join Group</button>)
                                        : null}
                                    {permission ? (<div className="specialButtons">
                                        <button className="singleButton" onClick={() => navigate(`/groups/${groupId}/events/new`)}>Create Event</button>
                                        <button className="singleButton" onClick={() => navigate(`/groups/${groupId}/edit`)}>Update</button>
                                        <button className="singleButton" onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this group?')) {
                                                handleDeleteConfirm();
                                            }
                                        }}>Delete</button>
                                    </div>) : null}
                                </div>
                            </div>
                        </section>
                    </section>
                    <div className="OrganizerAboutSec">
                        <h3>Organizer</h3>
                        <p> {Organizer.firstName} {Organizer.lastName} </p>
                        <h3>What we{'\''}re about</h3>
                        <p> {group.about} </p>
                    </div>
                </div>
                <section>
                    <GroupEventDetails />
                </section>
            </main>
        </>
    )
}

export default GroupComponent;
