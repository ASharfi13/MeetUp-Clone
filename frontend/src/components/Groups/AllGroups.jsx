import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllGroups, loadGroups } from "../../store/groups";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./AllGroups.css"


function AllGroups() {
    const dispatch = useDispatch();
    const groups = useSelector((state) => Object.values(state.groups));
    const navigate = useNavigate();

    console.log("Groups", groups);

    useEffect(() => {
        dispatch(fetchAllGroups());
    }, [dispatch])

    return (
        <>
            <section className="GroupHeader">
                <div className="GroupHeaderLinks">
                    <NavLink to="/groups" style={({ isActive }) => ({
                        color: isActive ? "teal" : "grey",
                        textDecoration: isActive ? "underline" : "none"
                    })}>Groups</NavLink>
                    <NavLink to="/events" style={({ isActive }) => ({
                        color: isActive ? "teal" : "grey",
                        textDecoration: isActive ? "underline" : "none"
                    })}>Events</NavLink>
                </div>
                <div className="GroupHeaderCaption">
                    <p>Groups in TheClub</p>
                </div>
            </section>

            <section>
                {groups.map((group) => (
                    <div className="GroupComponent" key={group.id} onClick={() => {
                        const url = `/groups/${group.id}`
                        navigate(url)
                    }}>
                        <img src={group.previewImage} />
                        <h3> {group.name}</h3>
                        <h4> {group.city}, {group.state}</h4>
                        <p> {group.about} </p>
                        <h5> {group.numEvents} Events • {group.private ? "Private" : "Public"} </h5>
                    </div>
                ))}
            </section>
        </>
    )
}

export default AllGroups;
