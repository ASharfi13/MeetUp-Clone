import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

function CreateGroupForm() {
    const dispatch = useDispatch();
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [priv, setPriv] = useState(false);
    const [groupImg, setGroupImg] = useState('');
    const [errObj, setErrObj] = useState({});

    const allStates = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE",
        "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY",
        "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO",
        "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC",
        "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD",
        "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ];

    const hello = 0;

    return (
        <>
            <section className="formHeader">
                <p>BECOME AN ORGANIZER</p>
                <h2>We'll walk you through a few steps to build your local community</h2>
            </section>
            <section className="mainForm">
                <form>
                    <div className="groupLocation">
                        <div className="locationDesc">
                            <h2>First, set your group's location.</h2>
                            <p>Meetup Groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online.</p>
                        </div>
                        <div className="locationInput">
                            <input
                                type="text"
                                value={city}
                                placeholder="City"
                                onChange={e => setCity(e.target.value)}
                            >
                            </input>
                            <select value={state} onChange={e => setState(e.target.value)}>
                                <option value="">Select a State</option>
                                {
                                    allStates.map((state, index) => (
                                        <option key={index} value={state}> {state} </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    <div className="groupName">
                        <h2>What will your group's name be?</h2>
                        <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
                        <input
                            type="text"
                            value={name}
                            placeholder="What's your group's name?"
                            onChange={e => setName(e.target.value)}
                        >
                        </input>
                    </div>

                    <div className="groupDesc">
                        <h2>Now describe what your group will be about</h2>
                        <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
                        <ol>
                            <li>What's the purpose of the group?</li>
                            <li>Who should join?</li>
                            <li>What will you do at your events?</li>
                        </ol>
                        <textarea rows={"10"} cols={"30"} value={description} onChange={e => setDescription(e.target.value)} placeholder="Please write at least 30 characters">
                        </textarea>
                    </div>

                    <div className="groupFinalSteps">
                        <h2>Final Steps...</h2>
                        <div className="groupType">
                            <p>Is this an in person or online group?</p>
                            <select value={type} onChange={e => setType(e.target.value)}>
                                <option value="" disabled>Select One</option>
                                {
                                    ["Online", "In person"].map((type, index) => (
                                        <option key={index} value={type}> {type} </option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="groupPrivate">
                            <p>Is this group public or private?</p>
                            <select value={priv ? "Private" : "Public"} onChange={e => {
                                e.target.value === "Private" ? setPriv(true) : setPriv(false);
                            }}>
                                {
                                    ["Private", "Public"].map((choice, index) => (
                                        <option key={index} value={choice}> {choice} </option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="groupImgUrl">
                            <p>Please add an image url for your group below:</p>
                            <input
                                type="url"
                                placeholder="Image Url"
                                value={groupImg}
                                onChange={e => setGroupImg(e.target.value)}
                            >
                            </input>
                        </div>
                    </div>
                    <button>
                        Create Group
                    </button>
                </form>
            </section>
        </>
    )
}

export default CreateGroupForm;
