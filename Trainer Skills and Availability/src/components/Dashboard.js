//Sets the trainers and courses to the scheduler calendar
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import {Redirect} from 'react-router-dom'
import Cal from './Cal'

class Dashboard extends Component {
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
        const {courses, auth, users, profile} = this.props;
        const trainers = this.getTrainers(users)
        //If not signed in redirect to signin page
        if (!auth.uid) return <Redirect to='/signin' />
        //If the logged in user is a trainer redirect to the appropiate trainer page
        if (profile.userType === 'trainer') return <Redirect to='/trainer' />
        return (
            <div className="dashboard container">
                <Cal courses={courses} trainers={trainers} type={profile.userType} history={this.props.history} />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        courses: state.firestore.ordered.courses,
        auth: state.firebase.auth,
        users: state.firestore.ordered.users,
        profile: state.firebase.profile

    }
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'courses', orderBy: ['createdAt', 'desc']},
        {collection: 'users'}
    ])
)(Dashboard)
