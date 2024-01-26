import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGroupComp } from "../../store/groups";

function CreateEventComponent() {
    const dispatch = useDispatch();
    const { groupId } = useParams();
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [price, setPrice] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [eventImg, setEventImg] = useState('');
    const [description, setDescription] = useState('');
    const [errObj, setErrObj] = useState({});
    const [showErrors, setShowErrors] = useState(false);


    const group = useSelector(state => state.groups.currGroup)

    const events = useSelector(state => Object.values(state.events.allEvents));

    useEffect(() => {
        dispatch(fetchGroupComp(groupId))
    }, [dispatch])

    useEffect(() => {
        const checkErrObj = {};
        if (name.length === 0) checkErrObj.nameMissing = "Name is required"
        if (name.length < 5) checkErrObj.nameLength = "Name must be at least 5 characters"
        if (!type) checkErrObj.typeMissing = "Event Type is required"

    })

    const convertPrice = (price) => {
        const numPrice = Number(price);

        return numPrice.toFixed(2);
    }

    return (
        <>
            <h1>Create an Event for {group.name}</h1>
            <section>
                <form>
                    <div className="eventName">
                        <p>What is the name of your event?</p>
                        <input type="text" placeholder="Event Name">
                        </input>
                    </div>
                    <div className="eventDetails">
                        <div>
                            <p>It this an in-person or online event?</p>
                            <select value={type} onChange={e => setType(e.target.value)}>
                                <option value='' disabled>Select One</option>
                                {
                                    ["Online", "In person"].map((type, index) => (
                                        <option key={index} value={type}> {type} </option>
                                    ))
                                }
                            </select>
                        </div>
                        <div>
                            <p>Is this event private or public?</p>
                            <select value={isPrivate ? "Private" : "Public"} onChange={e => {
                                e.target.value === "Private" ? setIsPrivate(true) : setIsPrivate(false);
                            }}>
                                {
                                    ["Private", "Public"].map((choice, index) => (
                                        <option key={index} value={choice}> {choice} </option>
                                    ))
                                }
                            </select>
                        </div>
                        <div>
                            <p>What </p>
                        </div>
                    </div>
                    <div className="eventTimeDetails">
                        <div>
                            <p>What time does your event start?</p>
                            <input
                                type="datetime-local">
                            </input>
                        </div>
                        <div>
                            <p>What time does your event end?</p>
                            <input type="datetime-local">
                            </input>
                        </div>
                    </div>
                    <div className="eventImageUrl">
                        <p>Please add an image url for your Event</p>
                        <input type="url" placeholder="Image Url"></input>
                    </div>
                    <div className="eventDescription">
                        <p>Please describe your event</p>
                        <textarea
                            placeholder="Please include at least 30 characters" rows={"10"} cols={"30"}
                            value={description} onChange={e => setDescription(e.target.value)}>

                        </textarea>
                    </div>
                    <button type="submit">
                        Create Event
                    </button>
                </form>
            </section>
        </>
    )
}


export default CreateEventComponent;
