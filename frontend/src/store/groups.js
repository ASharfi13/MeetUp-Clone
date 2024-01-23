import { csrfFetch } from "./csrf";

export const LOAD_GROUPS = '/groups/LOAD_GROUPS';
export const LOAD_GROUPCOMP = '/groups/LOAD_GROUPCOMP';


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
        case LOAD_GROUPCOMP: {
            const group = action.group;
            return group;
        }
        default:
            return state;
    }
}

export default groupReducer;
