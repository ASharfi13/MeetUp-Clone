import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllGroups } from "../../store/groups";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./AllGroups.css"


function AllGroups() {
    const dispatch = useDispatch();
    const groups = useSelector((state) => Object.values(state.groups.allGroups));
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchAllGroups());
    }, [dispatch])

    console.log(groups);

    return (
        <div className="allEventsRoot">
            <section className="EventHeader">
                <div className="EventHeaderLinks">
                    <NavLink to="/groups" style={({ isActive }) => ({
                        color: isActive ? "teal" : "grey",
                        textDecoration: isActive ? "underline" : "none"
                    })}>Worlds</NavLink>
                    <NavLink to="/events" style={({ isActive }) => ({
                        color: isActive ? "teal" : "grey",
                        textDecoration: isActive ? "underline" : "none"
                    })}>Events</NavLink>
                </div>
            </section>

            <section className="groupComponentSection">
                <div className="EventHeaderCaption">
                    <p className="EventHeaderCaptionText"> <span style={{ fontWeight: 'bold' }}>Worlds</span> at The Cartoon Social Network</p>
                </div>
                {groups?.map((group) => (
                    <div className="GroupComponent" key={group?.id} onClick={() => {
                        const url = `/groups/${group?.id}`
                        navigate(url)
                    }}>
                        <div className="GroupImgDetails">
                            <img className="GroupCompImg" src={group?.previewImage} />
                            <div className="GroupCompDetails">
                                <h2> {group?.name}</h2>
                                <p style={{ fontWeight: 'bold' }}> {group?.city}, {group.state}</p>
                                <p style={{ lineHeight: '1.25', fontSize: '14px' }}> {group?.about} </p>
                                <h5> {group?.numEvents} Events • {group?.private ? "Private" : "Public"} </h5>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
            <div className="LandButton">
            </div>
        </div>
    )
}

export default AllGroups;
