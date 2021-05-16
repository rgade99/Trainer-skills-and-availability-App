export const createCourse = (course) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        //make async call to DB
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid
        firestore.collection('courses').add({
            title: course.title,
            description: course.description,
            startDate: course.startDate,
            startTime: course.startTime,
            endDate: course.endDate,
            endTime: course.endTime,
            frequency: course.frequency,
            trainers: [course.trainers],
            authorFirstName: profile.firstName,
            authorLastName: profile.lastName,
            authorId: authorId,
            createdAt: new Date()
        }).then(() => {
            dispatch({ type: 'CREATE_COURSE', course });
        }).catch((err) => {
            dispatch({ type: 'CREATE_COURSE_ERROR', err}); 
        })
    }
};

export const updateCourse = (course) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        //make async call to DB
        const firestore = getFirestore();
        firestore.collection('courses').doc(course.id).update({
            title: course.title,
            description: course.description,
            frequency: course.frequency,
            startDate: course.startDate,
            startTime: course.startTime,
            endDate: course.endDate,
            endTime: course.endTime
        }).then(() => {
            dispatch({ type: 'UPDATE_COURSE', course });
        }).catch((err) => {
            dispatch({ type: 'UPDATE_COURSE_ERROR', err}); 
        })
    }
};

export const addTrainer = (course) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        //make async call to DB
        const firestore = getFirestore();
        firestore.collection('courses').doc(course.id).update({
            trainers: [...course.trainers, course.newTrainer]
        }).then(() => {
            dispatch({ type: 'ADD_TRAINER', course });
        }).catch((err) => {
            dispatch({ type: 'ADD_TRAINER_ERROR', err}); 
        })
    }
};

export const removeTrainer = (course) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        //make async call to DB
        const firestore = getFirestore();
        var trainers = [...course.trainers]
        var index = trainers.indexOf(course.trainer)
        if (index !== -1) {
            trainers.splice(index, 1);
        }
        firestore.collection('courses').doc(course.id).update({
            trainers: trainers
        }).then(() => {
            dispatch({ type: 'REMOVE_TRAINER', course });
        }).catch((err) => {
            dispatch({ type: 'REMOVE_TRAINER_ERROR', err}); 
        })
    }
};

export const deleteCourse = (course) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        //make async call to DB
        const firestore = getFirestore();
        firestore.collection('courses').doc(course.id).delete().then(() => {
            dispatch({ type: 'DELETE_COURSE', course });
        }).catch((err) => {
            dispatch({ type: 'DELETE_COURSE_ERROR', err}); 
        })
    }
};

export const addRequest = (request) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        //make async call to DB
        const firestore = getFirestore();
        firestore.collection('notifications').add({
            content: "Requested a schedule change",
            type: "request",
            request: request,
            createdAt: new Date(),
            status: "requested"
        }).then(() => {
            dispatch({ type: 'CREATE_REQUEST' });
        }).catch((err) => {
            dispatch({ type: 'CREATE_REQUEST_ERROR', err}); 
        })
    }
};

export const updateRequest = (newStatus, notification) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        //make async call to DB
        const firestore = getFirestore();
        firestore.collection('notifications').doc(notification).update({
            status: newStatus
        }).then(() => {
            dispatch({ type: 'UPDATE_REQUEST' });
        }).catch((err) => {
            dispatch({ type: 'UPDATE_REQUEST_ERROR', err}); 
        })
    }
};

export const addNotification = (content, newCourse) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        //make async call to DB
        const firestore = getFirestore();
        firestore.collection('notifications').add({
            content: content,
            type: "trainer",
            course: newCourse,
            createdAt: new Date()
        }).then(() => {
            dispatch({ type: 'CREATE_NOTIFICATION' });
        }).catch((err) => {
            dispatch({ type: 'CREATE_NOTIFICATION_ERROR', err}); 
        })
    }
};