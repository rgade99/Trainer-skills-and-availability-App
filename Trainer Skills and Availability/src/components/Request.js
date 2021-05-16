//Request by a trainer about schedule changing
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {addRequest} from '../store/courseActions'
import {Redirect} from 'react-router-dom'
import {compose} from 'redux'
import '../styles/form.css'
import {firestoreConnect} from 'react-redux-firebase'

class Request extends Component {
    state = {
        id: this.props.location.state.course.id,
        title: this.props.location.state.course.title,
        description: this.props.location.state.course.description,
        startDate: this.props.location.state.course.startDate,
        startTime: this.props.location.state.course.startTime,
        endDate: this.props.location.state.course.endDate,
        endTime: this.props.location.state.course.endTime,
        frequency: this.props.location.state.course.frequency,
        trainers: this.props.location.state.course.trainers,
        author: this.props.location.state.course.author,
        trainerRequesting: this.props.profile.firstName+" "+this.props.profile.lastName,
        trainerId: this.props.auth.uid
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.addRequest(this.state)
    }
    //Get the trainers
    getTrainers = (users) =>{
        var trainers = []
        users && users.forEach(user => {
            if(user.userType === "trainer"){
                trainers.push(user)
            }
        })
        return trainers
    }
    //Get the assigned trainers
    getAssignedTrainers(trainers, currentTrainers){
        var assigned = []
        currentTrainers.forEach(id => {
            for(var i=0; i< trainers.length; i++){
                if (trainers[i].id === id){assigned.push(trainers[i])}
            }
        });
        return assigned
    }
    getNotifications = (notifications, id) => {
        var trainerNotifications = []
        notifications && notifications.forEach(notification => {
            if(notification.type === "request" && notification.request.trainerId === id){
                trainerNotifications.push(notification)
            }
        });
        return trainerNotifications
    }
    checkNotification = (id, notifications) =>{
        for(var i=0; i<notifications.length; i++){
            if(notifications[i].request.id === id){
                return notifications[i]
            }
        }
    }
    render() {
        const {auth, users, profile, notifications} = this.props;
        const trainers = this.getTrainers(users)
        const course = this.props.location.state.course
        const currentTrainers = this.getAssignedTrainers(trainers, this.state.trainers)
        var trainerNotifications = this.getNotifications(notifications, auth.uid)
        var notification = this.checkNotification(course.id, trainerNotifications)
        if (!auth.uid) return <Redirect to='/signin' />
        if (profile.userType === 'scheduler') return <Redirect to='/' />
        return (
            <div className="container">
                <div className="card">
                    <div className="card-content">
                        <span className="card-title">Title: {this.state.title}</span>
                        <p>Description: {this.state.description}</p>
                        <p>Frequency: {this.state.frequency}</p><br/>
                        <p>Start: {this.state.startDate+" "+this.state.startTime}</p>
                        <p>End: {this.state.endDate+" "+this.state.endTime}</p><br/>
                        <p>Assigned Trainers: </p>
                        {currentTrainers && currentTrainers.map(trainer => {
                            return(
                                <p>{trainer.firstName + " " + trainer.lastName}</p>
                            )
                        })}<br/>
                        <p>Created by: {course.author}</p><br/>
                    </div>
                </div>

                <form onSubmit={this.handleSubmit} className="template white">
                    <h5 className="grey-text text-darken-3">Request Change</h5>

                    <div className="input-field">
                        <p>Schedule change requests are to be approved or rejected
                            by schedulers so any queries should be made to them directly.
                            You are not guaranteed to be removed from this course.
                            <br/><strong>Would you like to continue?</strong></p><br/>

                        {notification === undefined && 
                            <button className="btn cyan lighten-3">Confirm Request</button>
                        }
                    </div>
                    <div>
                        {notification !== undefined && notification.status === "requested" &&
                            <label>You have successfully submitted a change request. The current status is: <strong className="black-text">{notification.status}</strong></label>
                        }
                        {notification !== undefined && notification.status === "rejected" &&
                            <label>You have successfully submitted a change request. The current status is: <strong className="red-text">{notification.status}</strong></label>
                        }
                        {notification !== undefined && notification.status === "approved" &&
                            <label>You have already been <strong className="green-text">{notification.status}</strong> for this request but have been added back on by the scheduler. To request another change, contact the scheduler directly.</label>
                        }
                    </div>

                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        auth: state.firebase.auth,
        users: state.firestore.ordered.users,
        profile: state.firebase.profile,
        notifications: state.firestore.ordered.notifications
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addRequest: (notification) => dispatch(addRequest(notification))
    }
}


export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        {collection: 'courses', orderBy: ['createdAt', 'desc']},
        {collection: 'notifications'},
        {collection: 'users'}
    ])
)(Request)
