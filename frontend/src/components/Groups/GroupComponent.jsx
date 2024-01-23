import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGroupComp } from "../../store/groups";



function GroupComponent() {

    const { groupId } = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups);

    console.log(group)

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

    useEffect(() => {
        dispatch(fetchGroupComp(Number(groupId)));
    }, [dispatch, groupId])

    return (
        <>
            <section className="MainDetails">
                <div>
                    <img src={url} />
                </div>
                <div>
                    <h4> {group.name} </h4>
                    <p> {group.city}, {group.state} </p>
                    <p> {group.numEvents} Events • {group.private ? "Private" : "Public"}</p>
                    <p> Organized by {Organizer.firstName} {Organizer.lastName}</p>
                </div>
            </section>
        </>
    )
}

export default GroupComponent;
