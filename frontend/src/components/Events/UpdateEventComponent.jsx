import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEvent, fetchUpdateEvent } from "../../store/events";
import "./UpdateEventComponent.css";


function UpdateEventComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { eventId } = useParams();
    const event = useSelector(state => state.events.currEvent);
    const prevName = localStorage.getItem('eventName') || event.name || "";
    const prevType = localStorage.getItem('eventType') || event.type;
    const prevPrivate = localStorage.getItem('eventIsPrivate') || event.isPrivate;
    const prevPrice = localStorage.getItem('eventPrice') || event.price || 0;
    const prevCapacity = localStorage.getItem('eventCapacity') || event.capacity || '';
    const prevStartDate = localStorage.getItem('eventStartDate') || event.startDate || '';
    const prevEndDate = localStorage.getItem('eventEndDate') || event.endDate || "";
    const prevDescription = localStorage.getItem('eventDescription') || event.description || "";

    const todayDate = useMemo(() => new Date(), [])


    const convertPrice = (price) => {
        const numPrice = Number(price);

        return numPrice.toFixed(2);
    }


    const [name, setName] = useState(prevName);
    const [type, setType] = useState(prevType);
    const [isPrivate, setIsPrivate] = useState(prevPrivate);
    const [price, setPrice] = useState(prevPrice);
    const [capacity, setCapacity] = useState(prevCapacity);

    let [startDate, setStartDate] = useState(prevStartDate);
    let [endDate, setEndDate] = useState(prevEndDate);

    const [eventImg, setEventImg] = useState('');
    const [description, setDescription] = useState(prevDescription);
    const [showErrors, setShowErrors] = useState(false);
    const [errObj, setErrObj] = useState({});

    useEffect(() => {
        localStorage.setItem('eventName', name);
        localStorage.setItem('eventType', type);
        localStorage.setItem('eventIsPrivate', isPrivate);
        localStorage.setItem('eventPrice', price);
        localStorage.setItem('eventCapacity', capacity);
        localStorage.setItem('eventStartDate', startDate);
        localStorage.setItem('eventEndDate', endDate);
        localStorage.setItem('eventDescription', description);
    }, [name, type, isPrivate, price, capacity, startDate, endDate, description])

    useEffect(() => {
        const fetchData = async () => {
            await fetchEvent(eventId)
        }

        fetchData();
    }, [dispatch, eventId, event.id])

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
        if (nwEndDate <= nwStartDate) checkErrObj.invalidEndDate = "Please enter a valid end date that is AFTER the start date!"
        if (nwEndDate == "Invalid Date") checkErrObj.endDateMissing = "End date is required"

        const imgArr = eventImg.split(".");

        if (eventImg.length !== 0 && !["jpeg", "png", "jpg"].includes(imgArr[imgArr.length - 1])) checkErrObj.invalidImg = "Invalid Image Url, must end in .jpg, .jpeng, .png"
        if (description.length < 30) checkErrObj.descriptionLength = "Description must be at least 30 characters long"

        setErrObj(checkErrObj);
    }, [name, type, price, capacity, startDate, endDate, eventImg, description, todayDate])


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
            endDate
        }

        if (Object.values(errObj).length === 0) {
            dispatch(fetchUpdateEvent(newEvent, Number(eventId))).then(() => {
                localStorage.clear();
                navigate(`/events/${eventId}`)
            })
        } else {
            setShowErrors(true);
        }
    }


    return (
        <>
            <div className="mainForm">
                <h1 className="formUpdateTitle">Update your Event</h1>
                <form className="updateFormComponent" onSubmit={handleSubmit}>
                    <div className="groupName">
                        <h2>What is the name of your event</h2>
                        <input type="text" value={name} onChange={e => setName(e.target.value)}>
                        </input>
                    </div>
                    <div className="eventDetails">
                        <div>
                            <h2>It this an in-person or online event?</h2>
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
                            {'$'} <input type="number" placeholder="Valid Prices range $0-999"
                                value={price} onChange={e => setPrice(e.target.value)}></input>
                            {showErrors ? (
                                <p style={{ color: "red" }}>{errObj.invalidPrice}</p>
                            ) : null}
                        </div>
                        <div>
                            <p>What{'\''}s the most amount of people you can host at this event?</p>
                            <input type="number" placeholder="Enter Max Capacity"
                                value={capacity} onChange={e => setCapacity(e.target.value)}></input>
                            {showErrors ? (
                                <p style={{ color: "red" }}>{errObj.capacityMissing}</p>
                            ) : null}
                        </div>
                    </div>
                    <div className="eventTimeDetails">
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
                    <div className="eventImageUrl">
                        <p>Please add an image url for your Event</p>
                        <input type="url" placeholder="Image Url" value={eventImg} onChange={e => setEventImg(e.target.value)}></input>
                        {showErrors ? (
                            <p style={{ color: "red" }}>{errObj.invalidImg} {' '} {errObj.eventImgMissing}</p>
                        ) : null}
                    </div>
                    <div className="eventDescription">
                        <p>Please describe your event</p>
                        <textarea
                            placeholder="Please include at least 30 characters" rows={"10"} cols={"30"}
                            value={description} onChange={e => setDescription(e.target.value)}>
                        </textarea>
                        {showErrors ? (
                            <p style={{ color: "red" }}> {errObj.descriptionLength}</p>
                        ) : null}
                    </div>
                    <button type="submit">Update</button>
                </form>
            </div>
        </>
    )
}

export default UpdateEventComponent;
