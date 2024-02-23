import { csrfFetch } from "./csrf";

export const LOAD_GROUPS = '/groups/LOAD_GROUPS';
export const LOAD_GROUPCOMP = '/groups/LOAD_GROUPCOMP';
export const LOAD_GROUPEVENTS = '/groups/LOAD_GROUPEVENTS';
export const CREATE_ADD_GROUP = '/groups/CREATE_ADD_GROUP';
export const CREATE_ADD_GROUPIMAGE = '/groups/CREATE_ADD_GROUPIMAGE';
export const UPDATE_GROUP_DETAILS = '/groups/UPDATE_GROUP_DETAILS';
export const DELETE_GROUP = '/groups/DELETE_GROUP';
export const CLEAR_GROUP_EVENTS = '/groups/CLEAR_GROUP_EVENTS';


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

export const createAddGroup = (group) => {
    return {
        type: CREATE_ADD_GROUP,
        group
    }
}

export const createAddGroupImage = (groupImg) => {
    return {
        type: CREATE_ADD_GROUPIMAGE,
        groupImg
    }
}

export const updateGroupDetails = (group) => {
    return {
        type: UPDATE_GROUP_DETAILS,
        group
    }
}

export const deleteGroup = (groupId) => {
    return {
        type: DELETE_GROUP,
        groupId
    }
}

export const clearGroupEvents = (events) => {
    return {
        type: CLEAR_GROUP_EVENTS,
        payload: events
    }
}


//Action Thunks


//GET Thunks!
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

//Create A Group Action Thuunk
export const fetchCreateGroup = (group) => async (dispatch) => {
    const response = await csrfFetch('/api/groups', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(group)
    });

    if (response.ok) {
        const group = await response.json();
        dispatch(createAddGroup(group));
        return group;
    }
}


//Create Group Image
export const fetchCreateAddGroupImage = (newGroupImg, groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}/images`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newGroupImg)
    });

    if (response.ok) {
        const groupImg = await response.json();
        dispatch(createAddGroupImage(groupImg));
        return groupImg;
    }
}

//Update An Existing Group
export const fetchUpdateGroupDetails = (newGroup, groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newGroup)
    });

    if (response.ok) {
        const group = await response.json();
        dispatch(updateGroupDetails(group));
        return group;
    }
}

//Delete Group Thunk!

export const fetchDeleteGroup = (groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: "DELETE"
    })

    if (response.ok) {
        const group = await response.json();
        dispatch(deleteGroup(group));
        return group
    }
}

const initialState = {
    allGroups: [],
    currGroup: {},
    currGroupEvents: [],
    groupImages: []
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
        case CREATE_ADD_GROUP: {
            newState = {
                ...state
            }
            newState.allGroups[action.group.id] = action.group;
            return newState;
        }
        case DELETE_GROUP: {
            newState = { ...state };
            delete newState.allGroups[action.groupId];
            return newState;
        }
        case CLEAR_GROUP_EVENTS: {
            return newState = { ...state, currGroupEvents: { ...action.payload } };
        }
        default:
            return state;
    }
}

export default groupReducer;
