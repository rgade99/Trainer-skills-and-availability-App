const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello");
});

const createNotification = (notification => {
    return admin.firestore().collection('notifications')
    .add(notification)
    .then(doc => console.log('notification added', doc));
})

exports.courseCreated = functions.firestore
    .document('courses/{courseId}')
    .onCreate(doc => {
        const course = doc.data();
        const notification = {
            content: 'Added a new course',
            user: `${course.authorFirstName} ${course.authorLastName}`,
            time: admin.firestore.FieldValue.serverTimestamp(),
            type: 'course'
        }
        return createNotification(notification)
})
