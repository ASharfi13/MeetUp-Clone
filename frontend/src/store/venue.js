import { csrfFetch } from "./csrf";

export const LOAD_VENUES = '/events/LOAD_VENUES';

//Action Creators
export const loadVenues = (venues) => {
    return {
        type: LOAD_VENUES,
        venues
    }
}


//Action Thunks
//GET Thunks
export const fetchAllVenues = () => async (dispatch) => {
    const response = await csrfFetch('/api/venues/');

    if (response.ok) {
        const venues = await response.json();
        dispatch(loadVenues(venues));
        return venues;
    }
}

//Venues Reducer

const initialState = {
    allVenues: []
}

const venueReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_VENUES: {
            const normVenues = {}
            action.venues.allVenues.forEach((venue) => {
                normVenues[venue.id] = venue;
            })
            newState = {
                ...state, allVenues: { ...normVenues }
            }
            return newState;
        }
        default:
            return state
    }
}

export default venueReducer;
