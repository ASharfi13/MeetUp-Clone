import { csrfFetch } from "./csrf";

export const LOAD_EVENTS = 'events/LOAD_EVENTS';
export const LOAD_VENUES = 'events/LOAD_VENUES';

//Action Creators

export const loadEvents = (events) => {
    return {
        type: LOAD_EVENTS,
        events
    };
};

export const loadVenues = (eventId) => {
    
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

//Events Reducer

const eventReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_EVENTS: {
            const allEvents = {}
            action.events.Events.forEach((event) => {
                allEvents[event.id] = event;
            })
            return allEvents;
        }
        default:
            return state
    }
}

export default eventReducer;
