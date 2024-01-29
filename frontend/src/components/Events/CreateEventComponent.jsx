import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGroupComp } from "../../store/groups";
import { fetchAllEvents, fetchCreateEvent } from "../../store/events";
import "./CreateEventComponent.css";

function CreateEventComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { groupId } = useParams();
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [price, setPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [eventImg, setEventImg] = useState('');
    const [description, setDescription] = useState('');
    const [capacity, setCapacity] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [errObj, setErrObj] = useState({});
    const [showErrors, setShowErrors] = useState(false);

    const allStates = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE",
        "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY",
        "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO",
        "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC",
        "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD",
        "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ];


    const group = useSelector(state => state.groups.currGroup)

    const todayDate = useMemo(() => new Date(), [])

    const convertPrice = (price) => {
        const numPrice = Number(price);

        return numPrice.toFixed(2);
    }

    useEffect(() => {
        dispatch(fetchGroupComp(groupId))
        dispatch(fetchAllEvents())
    }, [dispatch, groupId])

    useEffect(() => {
        const checkErrObj = {};

        const nwStartDate = new Date(startDate);
        const nwEndDate = new Date(endDate);

        if (name.length === 0) checkErrObj.nameMissing = "Name is required"
        if (name.length < 5) checkErrObj.nameLength = "Name must be at least 5 characters"
        if (!type) checkErrObj.typeMissing = "Event Type is required"
        if (convertPrice(price) > 999.99 || convertPrice(price) < 0) checkErrObj.invalidPrice = "Invalid Price, please enter value between $0 and $999.99"
        if (capacity.length === 0) checkErrObj.capacityMissing = "Capacity is required"
        if (nwStartDate < todayDate) checkErrObj.invalidStartDate = "Please enter a valid start date! No previous days in the past!"
        if (nwStartDate == "Invalid Date") checkErrObj.startDateMissing = "Start date is required"
        if (nwEndDate < nwStartDate) checkErrObj.invalidEndDate = "Please enter a valid end date that is AFTER the start date!"
        if (nwEndDate == "Invalid Date") checkErrObj.endDateMissing = "End date is required"

        const imgArr = eventImg.split(".");

        if (eventImg.length !== 0 && !["jpeg", "png", "jpg"].includes(imgArr[imgArr.length - 1])) checkErrObj.invalidImg = "Invalid Image Url, must end in .jpg, .jpeng, .png"
        if (eventImg.length === 0) checkErrObj.eventImgMissing = "Event Img Url is required"
        if (description.length < 30) checkErrObj.descriptionLength = "Description must be at least 30 characters long"
        if (address.length === 0) checkErrObj.addressMissing = "Address is required"
        if (city.length === 0) checkErrObj.cityMissing = "City is required"
        if (!state || state.length === 0) checkErrObj.stateMissing = "State is required"

        setErrObj(checkErrObj);
    }, [name, type, price, capacity, startDate, endDate, eventImg, description, address, city, state, todayDate])

    const handleSubmit = (event) => {
        event.preventDefault();

        const newEvent = {
            venueId: null,
            name,
            type,
            capacity: Number(capacity),
            price: convertPrice(price),
            description,
            startDate,
            endDate,
            previewImg: eventImg,
            address,
            city,
            state
        }

        if (Object.values(errObj).length === 0) {
            dispatch(fetchCreateEvent(newEvent, Number(groupId))).then((event) => {
                navigate(`/events/${event.id}`)
            })
        } else {
            setShowErrors(true);
        }
    }

    return (
        <>
            <section className="theWholeThing">
                <h1>Create a New Event for {group.name}</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="eventComp">
                        <p>What is the name of your event?</p>
                        <input type="text" placeholder="Event Name" value={name} onChange={e => setName(e.target.value)}>
                        </input>
                        {showErrors ? (
                            <p style={{ color: "red" }}>{errObj.nameMissing} {' '} {errObj.nameLength}</p>
                        ) : null}
                    </div>
                    <div className="eventComp">
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
                            {showErrors ? (
                                <p style={{ color: "red" }}> {errObj.typeMissing} </p>
                            ) : null}
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
                            <p>What is the price of your Event?</p>
                            {'$'} <input type="number" placeholder="0"
                                value={price} onChange={e => setPrice(e.target.value)}></input>
                            {showErrors ? (
                                <p style={{ color: "red" }}>{errObj.invalidPrice}</p>
                            ) : null}
                        </div>
                        <div>
                            <p>What's the most amount of people you can host at this event?</p>
                            <input type="number" placeholder="Enter Max Capacity"
                                value={capacity} onChange={e => setCapacity(e.target.value)}></input>
                            {showErrors ? (
                                <p style={{ color: "red" }}>{errObj.capacityMissing}</p>
                            ) : null}
                        </div>
                    </div>
                    <div className="eventComp">
                        <div>
                            <p>What time does your event start?</p>
                            <input
                                type="datetime-local"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                            >
                            </input>
                            {showErrors ? (
                                <p style={{ color: "red" }}>{errObj.invalidStartDate} {' '} {errObj.startDateMissing}</p>
                            ) : null}
                        </div>
                        <div>
                            <p>What time does your event end?</p>
                            <input type="datetime-local"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                            >
                            </input>
                            {showErrors ? (
                                <p style={{ color: "red" }}>{errObj.invalidEndDate} {' '} {errObj.endDateMissing}</p>
                            ) : null}
                        </div>
                    </div>
                    <div className="eventComp">
                        <p>Please add an image url for your Event</p>
                        <input type="url" placeholder="Image Url" value={eventImg} onChange={e => setEventImg(e.target.value)}></input>
                        {showErrors ? (
                            <p style={{ color: "red" }}>{errObj.invalidImg} {' '} {errObj.eventImgMissing}</p>
                        ) : null}
                    </div>
                    <div className="eventComp">
                        <p>Please describe your event</p>
                        <textarea
                            placeholder="Please include at least 30 characters" rows={"10"} cols={"30"}
                            value={description} onChange={e => setDescription(e.target.value)}>
                        </textarea>
                        {showErrors ? (
                            <p style={{ color: "red" }}> {errObj.descriptionLength}</p>
                        ) : null}
                    </div>
                    <div className="eventComp">
                        <p>Please tell us where your Event is going to be located!</p>
                        <div>
                            <p>Address</p>
                            <input type="text" value={address} onChange={e => setAddress(e.target.value)}></input>
                            {showErrors ? (
                                <p style={{ color: "red" }}>{errObj.addressMissing}</p>
                            ) : null}
                        </div>
                        <div>
                            <p>City, State</p>
                            <input
                                type="text"
                                value={city}
                                placeholder="City"
                                onChange={e => setCity(e.target.value)}
                            >
                            </input>
                            <select value={state} onChange={e => setState(e.target.value)}>
                                <option value="" disabled>Select a State</option>
                                {
                                    allStates.map((state, index) => (
                                        <option key={index} value={state}> {state} </option>
                                    ))
                                }
                            </select>
                            {showErrors ? (
                                <p style={{ color: "red" }}>{errObj.cityMissing} {" "} {errObj.stateMissing}</p>
                            ) : null}
                        </div>
                    </div>
                    <button style={{ height: "40px" }} className="upEventButton" type="submit">
                        Create Event
                    </button>
                </form>
            </section>
        </>
    )
}


export default CreateEventComponent;
