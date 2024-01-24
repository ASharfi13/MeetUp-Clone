import { csrfFetch } from "./csrf";

export const LOAD_EVENTS = '/events/LOAD_EVENTS';
export const LOAD_EVENT = '/events/LOAD_EVENT';

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


//Action Thunks
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
        default:
            return state
    }
}

export default eventReducer;
