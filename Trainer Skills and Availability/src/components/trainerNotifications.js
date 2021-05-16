//Notifications with updates relevant for the trainer
import React, { Component } from 'react'
import moment from 'moment'
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import {Redirect} from 'react-router-dom'

class trainerNotifications extends Component {
    trainerNotifications = (notifications, auth) => {
        var courseNotifs = []

        notifications && notifications.forEach(notif => {
            if(notif.type === "trainer"){
                if(notif.content === "You have been removed from a course after requesting a change" && notif.course.trainerRequesting === auth.uid){
                    courseNotifs.push(notif)
                }
                else if(notif.content === "You have been added to an existing course" && notif.course.trainerToNotify === auth.uid){
                    courseNotifs.push(notif)
                }
                else if(notif.content === "You have been removed from a course" && notif.course.trainerToNotify === auth.uid){
                    courseNotifs.push(notif)
                }
                else if(notif.content === "You have been added to a new course" && notif.course.trainers === auth.uid){
                    courseNotifs.push(notif)
                }
                else if(notif.content === "A course you are assigned to has been updated" || notif.content === "A course you were assigned to has been deleted"){
                    notif.course.trainers.forEach(id => {
                        if (auth.uid === id){
                            courseNotifs.push(notif)
                        }
                    });
                }
            }
        });
        return courseNotifs
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
    getAssignedTrainers(trainers, currentTrainers){
        var assigned = []
        if(!Array.isArray(currentTrainers)){
            for(var i=0; i< trainers.length; i++){
                if (trainers[i].id === currentTrainers){
                    assigned.push(trainers[i])
                    break
                }
            }
        }
        else{
            currentTrainers.forEach(id => {
                for(var i=0; i< trainers.length; i++){
                    if (trainers[i].id === id){assigned.push(trainers[i])}
                }
            });
        }
        return assigned
    }
    render() {
        const {auth, notifications, profile, users} = this.props;
        var trainerNotifications = this.trainerNotifications(notifications, auth)
        const trainers = this.getTrainers(users)
        if (!auth.uid) return <Redirect to='/signin' />
        if (profile.userType === 'scheduler') return <Redirect to='/' />
        return (
            <div className="container">
                <div className="section">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">Notifications</span>
                            <ul className="notifications">
                                {trainerNotifications && trainerNotifications.map( item => {
                                    return(
                                        <li key={item.id}>
                                            <div className="card">
                                                <div className="card-content">
                                                <span className="blue-text">{item.content}</span>
                                                    <div class="grey-text note-date">
                                                        {moment(item.createdAt.toDate()).fromNow()}
                                                    </div>
                                                    <br/>
                                                    <span className="card-title">Title: {item.course.title}</span>
                                                    <p>Description: {item.course.description}</p>
                                                    <p>Frequency: {item.course.frequency}</p><br/>
                                                    <p>Start: {item.course.startDate+" "+item.course.startTime}</p>
                                                    <p>End: {item.course.endDate+" "+item.course.endTime}</p><br/>
                                                    <p>Assigned Trainers: </p>
                                                    {this.getAssignedTrainers(trainers, item.course.trainers) && this.getAssignedTrainers(trainers, item.course.trainers).map(trainer => {
                                                        return(
                                                            <p>{trainer.firstName + " " + trainer.lastName}</p>
                                                        )
                                                    })}<br/>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        auth: state.firebase.auth,
        notifications: state.firestore.ordered.notifications,
        profile: state.firebase.profile,
        users: state.firestore.ordered.users
    }
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'courses', orderBy: ['createdAt', 'desc']},
        {collection: 'notifications', orderBy: ['createdAt', 'desc']},
        {collection: 'users'}
    ])
)(trainerNotifications)
