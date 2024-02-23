import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchAllGroups, fetchCreateGroup } from "../../store/groups";
import "./CreateGroupForm.css";

function CreateGroupForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [priv, setPriv] = useState(false);
    const [groupImg, setGroupImg] = useState('');
    const [backgroundImg, setBackgroundImg] = useState("");
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

    useEffect(() => {
        dispatch(fetchAllGroups());
    }, [dispatch]);

    useEffect(() => {
        const submitErrObj = {};
        if (name.length > 60) submitErrObj.nameLength = "Name must be less than 60 characters"
        if (name.length === 0) submitErrObj.nameMissing = "Name is required"
        if (city.length === 0) submitErrObj.cityMissing = "City Name is required"
        if (state.length === 0) submitErrObj.stateMissing = "State is required"
        if (description.length !== 0 && description.length < 30) submitErrObj.descriptionLength = "Description must be 50 characters or more"
        if (description.length === 0) submitErrObj.descriptionMissing = "Description is required"
        if (!type) submitErrObj.typeMissing = "Type is required"
        if (groupImg.length === 0) submitErrObj.groupImgMissing = "Image URL is required"
        if (backgroundImg.length === 0) submitErrObj.backgroundImgNone = "Background Image Url is required"
        if (backgroundImg.length !== 0 && !["jpeg", "png", "jpg"].includes(backgroundImg[backgroundImg.length - 1])) submitErrObj.backgroundImgInvalid = "Invalid Background Image Url, must end in .jpg, .jpeg, .png"

        const imgArr = groupImg.split(".");

        if (groupImg.length !== 0 && !["jpeg", "png", "jpg"].includes(imgArr[imgArr.length - 1])) submitErrObj.invalidImg = "Invalid Image Url, must end in .jpg, .jpeg, .png"

        setErrObj(submitErrObj);
    }, [name, city, state, description, type, groupImg, backgroundImg])


    const handleSubmit = (event) => {
        event.preventDefault();

        const newGroup = {
            name,
            about: description,
            type,
            isPrivate: priv,
            city,
            state,
            previewImg: groupImg,
            backgroundImg
        }

        if (Object.values(errObj).length === 0) {
            dispatch(fetchCreateGroup(newGroup)).then((group) => {
                navigate(`/groups/${group.id}`)
            })
        } else {
            setShowErrors(true);
        }
    }


    return (
        <>
            <section className="mainForm">
                <p>BECOME AN ORGANIZER</p>
                <h2>Start A New World!</h2>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="groupComp">
                        <div className="locationDesc">
                            <h2>First, set your World{'\''}s location.</h2>
                            <p>Members of your World can meet locally, both in person and online. We{'\''}ll connect you with people in your area, and more can join you online.</p>
                        </div>
                        <div className="locationInput">
                            <input
                                className="input"
                                type="text"
                                value={city}
                                placeholder="City"
                                onChange={e => setCity(e.target.value)}
                            >
                            </input>
                            <select className="input" value={state} onChange={e => setState(e.target.value)}>
                                <option value="" disabled>Select a State</option>
                                {
                                    allStates.map((state, index) => (
                                        <option key={index} value={state}> {state} </option>
                                    ))
                                }
                            </select>
                        </div>
                        {showErrors ? (
                            <p style={{ color: "red" }}>{errObj.cityMissing} {" "} {errObj.stateMissing}</p>
                        ) : null}
                    </div>

                    <div className="groupComp">
                        <h2>What will your World{'\''}s name be?</h2>
                        <p>Choose a name that will give people a clear idea of what the World is about! Feel free to get creative! You can edit this later if you change your mind.</p>
                        <input
                            type="text"
                            className="input"
                            value={name}
                            placeholder="What's your World's name?"
                            onChange={e => setName(e.target.value)}
                        >
                        </input>
                    </div>
                    {showErrors ? (
                        <p style={{ color: 'red' }}>{errObj.nameMissing} {" "} {errObj.nameLength}</p>) : null
                    }

                    <div className="groupComp">
                        <h2>Now describe what your World will be about</h2>
                        <p>People will see this when we promote your World, but you{'\''}ll be able to add to it later, too.</p>
                        <ol>
                            <li>What{'\''}s the purpose of the World?</li>
                            <li>Who should join?</li>
                            <li>What will you do at your events?</li>
                        </ol>
                        <textarea rows={"10"} cols={"30"} value={description} onChange={e => setDescription(e.target.value)} placeholder="Please write at least 30 characters">
                        </textarea>
                    </div>
                    {showErrors ? (
                        <p style={{ color: "red" }}>{errObj.descriptionMissing} {" "} {errObj.descriptionLength}</p>
                    ) : null}

                    <div className="groupComp">
                        <h2>Final Steps...</h2>
                        <div className="groupType">
                            <p>Is this an in person or online World?</p>
                            <select className="input" value={type} onChange={e => setType(e.target.value)}>
                                <option value="" disabled>Select One</option>
                                {
                                    ["Online", "In person"].map((type, index) => (
                                        <option key={index} value={type}> {type} </option>
                                    ))
                                }
                            </select>
                        </div>

                        {showErrors ? (
                            <p style={{ color: "red" }}> {errObj.typeMissing} </p>
                        ) : null}

                        <div className="groupComp">
                            <p>Is this World public or private?</p>
                            <select className="input" value={priv ? "Private" : "Public"} onChange={e => {
                                e.target.value === "Private" ? setPriv(true) : setPriv(false);
                            }}>
                                {
                                    ["Private", "Public"].map((choice, index) => (
                                        <option key={index} value={choice}> {choice} </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="groupComp">
                            <p>Please add an image url for your World below:</p>
                            <input
                                type="url"
                                className="input"
                                placeholder="Image Url"
                                value={groupImg}
                                onChange={e => setGroupImg(e.target.value)}
                            >
                            </input>
                        </div>

                        {showErrors ? (
                            <p style={{ color: "red" }}> {errObj.groupImgMissing} {" "} {errObj.invalidImg} </p>
                        ) : null}

                        <div className="groupComp">
                            <p>Please add an image url for the background of the page! It's recommended you choose an image from Cartoon Network Backgrounds!</p>
                            <input
                                type="url"
                                className="input"
                                placeholder="Background Image Url"
                                value={backgroundImg}
                                onChange={e => setBackgroundImg(e.target.value)}
                            >
                            </input>
                        </div>

                        {showErrors ? (
                            <p style={{ color: 'red' }}>{errObj.backgroundImgNone} {" "} {errObj.backgroundImgInvalid}</p>
                        ) : null}
                    </div>
                    <button className="cpuButton" type="submit"
                    >
                        Create World!
                    </button>
                </form>
            </section>
        </>
    )
}

export default CreateGroupForm;
