//Sets the calendar for the trainer
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import {Redirect} from 'react-router-dom'
import Cal from './Cal'

class TrainerDashboard extends Component {
  //Gets the courses of the trainer
    getCourses = (courses, auth) =>{
        var trainerCourses = []
        courses && courses.forEach(course => {
            if(course.trainers.includes(auth.uid)){
                trainerCourses.push(course)
            }
        })
        return trainerCourses
    }
    //Gets the trainers
    getTrainers = (users) =>{
        var trainers = []
        users && users.forEach(user => {
            if(user.userType === "trainer"){
                trainers.push(user)
            }
        })
        return trainers
    }
    render() {
        const {courses, auth, users} = this.props;
        var trainerCourses = this.getCourses(courses, auth)
        const trainers = this.getTrainers(users)
        
        //If not signed in redirect to signin page
        if (!auth.uid) return <Redirect to='/signin' />
        return (
            <div className="dashboard container">
                <Cal courses={trainerCourses} trainers={trainers} type={"trainer"} history={this.props.history} />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        courses: state.firestore.ordered.courses,
        auth: state.firebase.auth,
        users: state.firestore.ordered.users,
    }
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'courses', orderBy: ['createdAt', 'desc']},
        {collection: 'users'}
    ])
)(TrainerDashboard)
