//Show th eupdates of the requests
import React, { Component } from 'react'
import Notifications from './Notifications'
import Requests from './Requests'
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import {Redirect} from 'react-router-dom'

class Updates extends Component {
    courseNotifications = (notifications) => {
        var courseNotifs = []
        notifications && notifications.forEach(notif => {
            if(notif.type === "course"){
                courseNotifs.push(notif)
            }
        });
        return courseNotifs
    }
    render() {
        const {auth, notifications, profile} = this.props;
        var courseNotifications = this.courseNotifications(notifications)
        //If not signed in redirect to signin page
        if (!auth.uid) return <Redirect to='/signin' />
        //If the logged in user is a trainer redirect to the appropiate trainer page
        if (profile.userType === 'trainer') return <Redirect to='/trainer' />
        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m6">
                        <Requests type="requested" title="Open Requests"/>
                        <Requests type="rejected" title="Rejected Requests"/>
                        <Requests type="approved" title="Approved Requests"/>
                    </div>
                    <div className="col s12 m5 offset-m1">
                        <Notifications notifications={courseNotifications}/>
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
        profile: state.firebase.profile
    }
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'notifications'},
        {collection: 'users'}
    ])
)(Updates)
