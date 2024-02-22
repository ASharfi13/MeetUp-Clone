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
        <>
            <section className="GroupHeader">
                <div className="GroupHeaderLinks">
                    <NavLink to="/groups" style={({ isActive }) => ({
                        color: isActive ? "teal" : "grey",
                        textDecoration: isActive ? "underline" : "none"
                    })}>Worlds</NavLink>
                    <NavLink to="/events" style={({ isActive }) => ({
                        color: isActive ? "teal" : "grey",
                        textDecoration: isActive ? "underline" : "none"
                    })}>Events</NavLink>
                </div>
                <div className="GroupHeaderCaption">
                    <p> <span style={{ fontWeight: 'bold' }}>Worlds</span> at The Cartoon Social Network</p>
                </div>
            </section>

            <section className="groupComponentSection">
                {groups?.map((group) => (
                    <div className="GroupComponent" key={group?.id} onClick={() => {
                        const url = `/groups/${group?.id}`
                        navigate(url)
                    }}>
                        <img src={group?.previewImage} />
                        <h3> {group?.name}</h3>
                        <p> {group?.city}, {group.state}</p>
                        <p> {group?.about} </p>
                        <h5> {group?.numEvents} Events • {group?.private ? "Private" : "Public"} </h5>
                    </div>
                ))}
            </section>
        </>
    )
}

export default AllGroups;
