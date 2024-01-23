import { csrfFetch } from "./csrf";

export const LOAD_GROUPS = '/groups/LOAD_GROUPS';
export const LOAD_GROUPCOMP = '/groups/LOAD_GROUPCOMP';
export const LOAD_GROUPEVENTS = '/groups/LOAD_GROUPEVENTS';


//Action Creators

export const loadGroups = (groups) => {
    return {
        type: LOAD_GROUPS,
        groups
    };
};

export const loadGroupComp = (group) => {
    return {
        type: LOAD_GROUPCOMP,
        group
    }
}

export const loadGroupEvents = (events) => {
    return {
        type: LOAD_GROUPEVENTS,
        events
    }
}


//Action Thunks

export const fetchAllGroups = () => async (dispatch) => {
    const response = await csrfFetch('/api/groups/');

    if (response.ok) {
        const groups = await response.json();

        dispatch(loadGroups(groups));
        return groups;
    }
}

export const fetchGroupComp = (groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}`);

    if (response.ok) {
        const group = await response.json();

        dispatch(loadGroupComp(group));
        return group;
    }
}

export const fetchGroupEvents = (groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`);

    if (response.ok) {
        const events = await response.json();

        dispatch(loadGroupEvents(events));
        return events;
    }
}

const initialState = {
    allGroups: [],
    currGroup: {},
    currGroupEvents: []
}

//Group Reducer

const groupReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_GROUPS: {
            const normAllGroups = {}
            action.groups.Groups.forEach((group) => {
                normAllGroups[group.id] = group;
            })
            newState = {
                ...state, allGroups: { ...normAllGroups }
            }
            return newState;
        }
        case LOAD_GROUPCOMP: {
            newState = {
                ...state, currGroup: { ...action.group }
            }
            return newState;
        }
        case LOAD_GROUPEVENTS: {
            const normGroupEvents = {}
            action.events.Events.forEach((event) => {
                normGroupEvents[event.id] = event;
            })
            newState = {
                ...state, currGroupEvents: { ...normGroupEvents }
            };
            return newState;
        }
        default:
            return state;
    }
}

export default groupReducer;
