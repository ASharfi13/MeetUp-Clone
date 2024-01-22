import { csrfFetch } from "./csrf";

export const LOAD_GROUPS = '/groups/LOAD_GROUPS';


//Action Creators

export const loadGroups = (groups) => {
    return {
        type: LOAD_GROUPS,
        groups
    };
};


//Action Thunks

export const fetchAllGroups = () => async (dispatch) => {
    const response = await csrfFetch('/api/groups/');

    if (response.ok) {
        const groups = await response.json();

        dispatch(loadGroups(groups));
        return groups;
    }
}

//Group Reducer


const groupReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_GROUPS: {
            const allGroups = {}
            action.groups.Groups.forEach((group) => {
                allGroups[group.id] = group;
            })
            return allGroups;
        }
        default:
            return state;
    }
}

export default groupReducer;
