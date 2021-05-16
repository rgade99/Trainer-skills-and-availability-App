//Manage the request made and check the outcome
import moment from 'moment'
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {withRouter} from 'react-router-dom';
import {updateRequest, removeTrainer, addNotification} from '../store/courseActions'

class Requests extends Component {
  //In case a request is approved
    remove = (notification) => {
        this.props.updateRequest("approved", notification.id)
        var course = this.getCourse(notification.request.id)
        var newCourse = {
            id: course.id,
            trainers: course.trainers,
            trainer: notification.request.trainerId
        }
        this.props.addNotification("You have been removed from a course after requesting a change", {...course, trainerRequesting: notification.request.trainerId})
        this.props.removeTrainer(newCourse)
    }
    //In case a request is rejected
    reject = (notification) => {
        var course = this.getCourse(notification.request.id)
        this.props.addNotification("Your change request has been rejected", course)
        this.props.updateRequest("rejected", notification.id)
    }
    add = (notification) => {
        this.props.history.push({
            pathname: '/addtrainer',
            state: {
              course: this.getCourse(notification.request.id)
            }
          })
    }
    openRequests = (notifications) => {
        var openRequests = []
        notifications && notifications.forEach(notification => {
            if(notification.status === this.props.type){
                if(this.getCourse(notification.request.id) !== undefined){
                    openRequests.push(notification)
                }
            }
        })
        return openRequests
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
    //Get the course of the trainer
    getCourse = (id) => {
        var courses = this.props.courses
        for(var i=0; i<courses.length; i++){
            if(courses[i].id === id){
                return courses[i]
            }
        }
    }
    render() {
        const {notifications, auth, profile, users} = this.props;
        var openRequests = this.openRequests(notifications)
        const trainers = this.getTrainers(users)
        if (!auth.uid) return <Redirect to='/signin' />
        if (profile.userType === 'trainer') return <Redirect to='/trainer' />
        return (
            <div className="section">
                <div className="card">
                    <div className="card-content">
                        <span className="card-title">{this.props.title}</span>
                        <ul className="notifications">
                            {openRequests.length === 0 &&
                                <p>There are no requests to show</p>
                            }
                            {openRequests && openRequests.map( notification => {
                                return(
                                    <li key={notification.id}>
                                        <span className="blue-text">Trainer: {notification.request.trainerRequesting} </span>
                                        <div class="grey-text note-date">
                                            Trainer ID: {notification.request.trainerId}
                                        </div>
                                        <span>{notification.content}</span>
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
                                        <div class="grey-text note-date">
                                            {moment(notification.createdAt.toDate()).fromNow()}
                                        </div>
                                        {this.props.type === "requested" && this.getAssignedTrainers(trainers, notification.request.id).length !== 1 &&
                                            <div className="input-field">
                                                <button type="button" onClick={() => this.remove(notification)} className="btn cyan lighten-3">Approve</button>
                                                <button type="button" onClick={() => this.reject(notification)} className="btn cyan lighten-3 extra">Reject</button>
                                            </div>
                                        }
                                        {this.props.type === "requested" && this.getAssignedTrainers(trainers, notification.request.id).length === 1 &&
                                            <div className="input-field">
                                                <button type="button" onClick={() => this.add(notification)} className="btn cyan lighten-3">Add</button>
                                                <button type="button" onClick={() => this.reject(notification)} className="btn cyan lighten-3 extra">Reject</button>
                                            </div>
                                        }

                                    </li>
                                )
                            })}
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

const mapDispatchToProps = (dispatch) => {
    return {
        removeTrainer: (course) => dispatch(removeTrainer(course)),
        updateRequest: (status, id) => dispatch(updateRequest(status, id)),
        addNotification: (notification, course) => dispatch(addNotification(notification, course))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Requests))
