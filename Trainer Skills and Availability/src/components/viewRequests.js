//Show the requests made by the trainer
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'

class viewRequests extends Component {
  //Requests not yet processed
    openRequests = (notifications) => {
        var openRequests = []
        notifications && notifications.forEach(notification => {
            if(notification.status === "requested"){
                openRequests.push(notification)
            }
        })
        return openRequests
    }
    //Approved requests
    approvedRequests = (notifications) => {
        var openRequests = []
        notifications && notifications.forEach(notification => {
            if(notification.status === "approved"){
                openRequests.push(notification)
            }
        })
        return openRequests
    }
    //Rejected requests
    rejectedRequests = (notifications) => {
        var openRequests = []
        notifications && notifications.forEach(notification => {
            if(notification.status === "rejected"){
                openRequests.push(notification)
            }
        })
        return openRequests
    }
    //Get trainers
    getTrainers = (users) =>{
        var trainers = []
        users && users.forEach(user => {
            if(user.userType === "trainer"){
                trainers.push(user)
            }
        })
        return trainers
    }
    //Get assigned trainers
    getAssignedTrainers(trainers, courseId){
        var course = this.getCourse(courseId)
        var assigned = []
        course.trainers.forEach(id => {
            for(var i=0; i< trainers.length; i++){
                if (trainers[i].id === id){assigned.push(trainers[i])}
            }
        });
        return assigned
    }
    //Get the trainer's courses
    getCourse = (id) => {
        var courses = this.props.courses
        for(var i=0; i<courses.length; i++){
            if(courses[i].id === id){
                return courses[i]
            }
        }
    }
    //Get the notifications
    getNotifications = (notifications, id) => {
        var trainerNotifications = []
        notifications && notifications.forEach(notification => {
            if(notification.type === "request" && notification.request.trainerId === id){
                if(this.getCourse(notification.request.id) !== undefined){
                    trainerNotifications.push(notification)
                }
            }
        });
        return trainerNotifications
    }
    render() {
        const {notifications, auth, profile, users} = this.props;
        var trainerNotifications = this.getNotifications(notifications, auth.uid)
        var openRequests = this.openRequests(trainerNotifications)
        var approvedRequests = this.approvedRequests(trainerNotifications)
        var rejectedRequests = this.rejectedRequests(trainerNotifications)
        const trainers = this.getTrainers(users)
        //If not signed in redirect to signin page
        if (!auth.uid) return <Redirect to='/signin' />
        //If the logged in user is a trainer redirect to the appropiate trainer page
        if (profile.userType === 'scheduler') return <Redirect to='/' />
        return (
            <div className="container">
                <div className="card">
                    <div className="card-content">
                        <span className="card-title">Open Requests</span>
                        <ul className="notifications">
                            {openRequests && openRequests.map( notification => {
                                return(
                                    <li key={notification.id}>
                                        <div className="card">
                                            <div className="card-content">
                                                <span className="card-title">Title: {notification.request.title}</span>
                                                <p>Description: {notification.request.description}</p>
                                                <p>Frequency: {notification.request.frequency}</p><br/>
                                                <p>Start: {notification.request.startDate+" "+notification.request.startTime}</p>
                                                <p>End: {notification.request.endDate+" "+notification.request.endTime}</p><br/>
                                                <p>Assigned Trainers: </p>
                                                {this.getAssignedTrainers(trainers, notification.request.id) && this.getAssignedTrainers(trainers, notification.request.id).map(trainer => {
                                                    return(
                                                        <p>{trainer.firstName + " " + trainer.lastName}</p>
                                                    )
                                                })}<br/>
                                                <p>Created by: {notification.request.author}</p><br/>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                            {openRequests.length === 0 &&
                                <p>You have no open requests</p>
                            }
                        </ul>
                    </div>
                </div>

                <div className="card">
                    <div className="card-content">
                        <span className="card-title">Approved Requests</span>
                        <ul className="notifications">
                            {approvedRequests && approvedRequests.map( notification => {
                                return(
                                    <li key={notification.id}>
                                        <div className="card">
                                            <div className="card-content">
                                                <span className="card-title">Title: {notification.request.title}</span>
                                                <p>Description: {notification.request.description}</p>
                                                <p>Frequency: {notification.request.frequency}</p><br/>
                                                <p>Start: {notification.request.startDate+" "+notification.request.startTime}</p>
                                                <p>End: {notification.request.endDate+" "+notification.request.endTime}</p><br/>
                                                <p>Assigned Trainers: </p>
                                                {this.getAssignedTrainers(trainers, notification.request.id) && this.getAssignedTrainers(trainers, notification.request.id).map(trainer => {
                                                    return(
                                                        <p>{trainer.firstName + " " + trainer.lastName}</p>
                                                    )
                                                })}<br/>
                                                <p>Created by: {notification.request.author}</p><br/>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                            {approvedRequests.length === 0 &&
                                <p>You have no approved requests</p>
                            }
                        </ul>
                    </div>
                </div>

                <div className="card">
                    <div className="card-content">
                        <span className="card-title">Rejected Requests</span>
                        <ul className="notifications">
                            {rejectedRequests && rejectedRequests.map( notification => {
                                return(
                                    <li key={notification.id}>
                                        <div className="card">
                                            <div className="card-content">
                                                <span className="card-title">Title: {notification.request.title}</span>
                                                <p>Description: {notification.request.description}</p>
                                                <p>Frequency: {notification.request.frequency}</p><br/>
                                                <p>Start: {notification.request.startDate+" "+notification.request.startTime}</p>
                                                <p>End: {notification.request.endDate+" "+notification.request.endTime}</p><br/>
                                                <p>Assigned Trainers: </p>
                                                {this.getAssignedTrainers(trainers, notification.request.id) && this.getAssignedTrainers(trainers, notification.request.id).map(trainer => {
                                                    return(
                                                        <p>{trainer.firstName + " " + trainer.lastName}</p>
                                                    )
                                                })}<br/>
                                                <p>Created by: {notification.request.author}</p><br/>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                            {rejectedRequests.length === 0 &&
                                <p>You have no rejected requests</p>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        notifications: state.firestore.ordered.notifications,
        auth: state.firebase.auth,
        profile: state.firebase.profile,
        courses: state.firestore.ordered.courses,
        users: state.firestore.ordered.users
    }
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'courses', orderBy: ['createdAt', 'desc']},
        {collection: 'notifications'},
        {collection: 'users'}
    ])
)(viewRequests)
