import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGroupComp, fetchUpdateGroupDetails } from "../../store/groups";
import "./UpdateGroupComp.css";

function UpdateGroupComp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { groupId } = useParams();
    const group = useSelector(state => state.groups.currGroup);
    const prevCity = localStorage.getItem('city') || group.city || "";
    const prevState = localStorage.getItem('state') || group.state || "";
    const prevGroupName = localStorage.getItem('name') || group.name || "";
    const prevDescription = localStorage.getItem('description') || group.about || "";
    const prevType = localStorage.getItem('type') || group.type;
    const prevPrivate = localStorage.getItem('isPrivate') || group.private

    const allStates = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE",
        "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY",
        "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO",
        "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC",
        "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD",
        "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ];


    //The useStates!
    const [city, setCity] = useState(prevCity);
    const [state, setState] = useState(prevState);
    const [name, setName] = useState(prevGroupName);
    const [description, setDescription] = useState(prevDescription);
    const [type, setType] = useState(prevType);
    const [isPrivate, setIsPrivate] = useState(prevPrivate);
    const [addImg, setAddImg] = useState('');
    const [showErrors, setShowErrors] = useState(false);
    const [errObj, setErrObj] = useState({});

    useEffect(() => {
        localStorage.setItem("city", city);
        localStorage.setItem("state", state);
        localStorage.setItem("name", name);
        localStorage.setItem("description", description);
        localStorage.setItem("type", type);
        localStorage.setItem("isPrivate", isPrivate);
    }, [city, state, name, description, type, isPrivate])

    //////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        const submitErrObj = {};
        if (name.length > 60) submitErrObj.nameLength = "Name must be less than 60 characters"
        if (name.length === 0) submitErrObj.nameMissing = "Name is required"
        if (city.length === 0) submitErrObj.cityMissing = "City Name is required"
        if (state.length === 0) submitErrObj.stateMissing = "State is required"
        if (description.length !== 0 && description.length < 50) submitErrObj.descriptionLength = "Description must be 50 characters or more"
        if (description.length === 0) submitErrObj.descriptionMissing = "Description is required"
        if (!type) submitErrObj.typeMissing = "Type is required"

        const imgArr = addImg.split(".");

        if (addImg.length !== 0 && !["jpeg", "png", "jpg"].includes(imgArr[imgArr.length - 1])) submitErrObj.invalidImg = "Invalid Image Url, must end in .jpg, .jpeng, .png"

        setErrObj(submitErrObj);
    }, [name, city, state, description, type, addImg])

    useEffect(() => {
        dispatch(fetchGroupComp(Number(groupId)))
    }, [dispatch, groupId])

    const handleSubmit = (event) => {
        event.preventDefault();

        const newGroup = {
            name,
            about: description,
            type,
            isPrivate: JSON.parse(isPrivate),
            city,
            state,
        }

        if (Object.values(errObj).length === 0) {
            dispatch(fetchUpdateGroupDetails(newGroup, Number(groupId)))
            localStorage.clear();
            navigate(`/groups/${group.id}`)
        } else {
            setShowErrors(true);
        }
    }

    return (
        <>
            <section className="mainForm">
                <p>UPDATE YOUR WORLD{'\''}S INFORMATION</p>
                <h1>We{'\''}ll walk you through a few steps to update your World{'\''}s information</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="groupComp">
                        <h1>First, set your group{'\''}s location</h1>
                        <p>Worlds meet locally, in-person and online. We{'\''}ll connect you with people in your area, and more can join you online.</p>
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
                    <div className="groupComp">
                        <h1>What is the name of your World?</h1>
                        <p>Choose a name that will give people a clear idea of what the World is about. Feel free to get creative!</p>
                        <input
                            type="text"
                            value={name}
                            placeholder="What's your group's name?"
                            onChange={e => setName(e.target.value)}
                        >
                        </input>
                        {showErrors ? (
                            <p style={{ color: 'red' }}>{errObj.nameMissing} {" "} {errObj.nameLength}</p>) : null
                        }
                    </div>
                    <div className="groupComp">
                        <h2>Now describe what your World will be about</h2>
                        <p>People will see this when we promote your World, but you{'\''}ll be able to add to it later, too.</p>
                        <ol>
                            <li>What{'\''}s the purpose of the World?</li>
                            <li>Who should join?</li>
                            <li>What will you do at your events?</li>
                        </ol>
                        <textarea rows={"10"} cols={"30"} value={description} onChange={e => setDescription(e.target.value)} placeholder="Please write at least 50 characters">
                        </textarea>
                        {showErrors ? (
                            <p style={{ color: "red" }}>{errObj.descriptionMissing} {" "} {errObj.descriptionLength}</p>
                        ) : null}
                    </div>
                    <div className="groupComp">
                        <h2>Final Steps...</h2>
                        <div className="groupType">
                            <p>Is this an in person or online World?</p>
                            <select value={type} onChange={e => setType(e.target.value)}>
                                <option value="" disabled>Select One</option>
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

                        <div className="groupPrivate">
                            <p>Is this World public or private?</p>
                            <select value={isPrivate ? "Private" : "Public"} onChange={e => {
                                setIsPrivate(e.target.value === "Private")
                            }}>
                                <option value='' disabled>Select One</option>
                                {
                                    ["Private", "Public"].map((choice, index) => (
                                        <option key={index} value={choice}> {choice} </option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="groupImgUrl">
                            <p>Please add an image url for your World below:</p>
                            <input
                                type="url"
                                placeholder="Image Url"
                                value={addImg}
                                onChange={e => setAddImg(e.target.value)}
                            >
                            </input>
                            {showErrors ? (
                                <p style={{ color: "red" }}> {errObj.invalidImg} </p>
                            ) : null}
                        </div>
                    </div>
                    <button className="cpuButton" type="submit">Update</button>
                </form>
            </section>
        </>
    )
}

export default UpdateGroupComp;
