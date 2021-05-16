const initState = {
}

const courseReducer = (state = initState, action) => {
    switch (action.type) {
        case 'CREATE_COURSE':
            console.log('created course', action.course);
            return state;
        case 'CREATE_COURSE_ERROR':
            console.log('create course error', action.err);
            return state;
        case 'UPDATE_COURSE':
            console.log('updated course', action.course);
            return state;
        case 'UPDATE_COURSE_ERROR':
            console.log('update course error', action.err);
            return state;
        case 'ADD_TRAINER':
            console.log('added new trainer', action.course);
            return state;
        case 'ADD_TRAINER_ERROR':
            console.log('error adding new trainer', action.err);
            return state;
        case 'REMOVE_TRAINER':
            console.log('removed trainer', action.course);
            return state;
        case 'REMOVE_TRAINER_ERROR':
            console.log('error removing trainer', action.err);
            return state;
        case 'DELETE_COURSE':
            console.log('deleted course', action.course);
            return state;
        case 'DELETE_COURSE_ERROR':
            console.log('error deleting course', action.err);
            return state;
        case 'CREATE_REQUEST':
            console.log('created request');
            return state;
        case 'CREATE_REQUEST_ERROR':
            console.log('error creating request', action.err);
            return state;
        case 'UPDATE_REQUEST':
            console.log('updated request');
            return state;
        case 'UPDATE_REQUEST_ERROR':
            console.log('error updating request', action.err);
            return state;
        case 'CREATE_NOTIFICATION':
            console.log('created notification');
            return state;
        case 'CREATE_NOTIFICATION_ERROR':
            console.log('error creating notification', action.err);
            return state;
        default:
            return state;
    }
}

export default courseReducer