import { csrfFetch } from "./csrf";
import { CREATE_ADD_GROUP } from "./groups";

export const LOAD_EVENTS = '/events/LOAD_EVENTS';
export const LOAD_EVENT = '/events/LOAD_EVENT';
export const CREATE_ADD_EVENT = '/events/CREATE_ADD_EVENT';

//Action Creators

export const loadEvents = (events) => {
    return {
        type: LOAD_EVENTS,
        events
    };
};

export const loadEvent = (event) => {
    return {
        type: LOAD_EVENT,
        event
    }
}

export const addCreateEvent = (event) => {
    return {
        type: CREATE_ADD_EVENT,
        event
    }
}

//Action Thunks
//GET Thunks
export const fetchAllEvents = () => async (dispatch) => {
    const response = await csrfFetch('/api/events/');

    if (response.ok) {
        const events = await response.json();

        dispatch(loadEvents(events));
        return events;
    }
}

export const fetchEvent = (eventId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}`);

    if (response.ok) {
        const event = await response.json();

        dispatch(loadEvent(event))
        return event
    }
}

//CREATE ACTION THUNK
export const fetchCreateEvent = (event, groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
    });

    if (response.ok) {
        const newEvent = await response.json();
        dispatch(addCreateEvent(newEvent));
        return newEvent
    }
}


//Events Reducer

const initialState = {
    allEvents: [],
    currEvent: {},
    currEventGroup: {}
}

const eventReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_EVENTS: {
            const normEvents = {}
            action.events.Events.forEach((event) => {
                normEvents[event.id] = event;
            })
            newState = {
                ...state, allEvents: { ...normEvents }
            }
            return newState
        }
        case LOAD_EVENT: {
            newState = {
                ...state, currEvent: { ...action.event }
            }
            return newState;
        }
        case CREATE_ADD_EVENT: {
            newState = { ...state };
            newState.allEvents[action.event.id] = action.event;
            return newState;
        }
        default:
            return state
    }
}

export default eventReducer;
