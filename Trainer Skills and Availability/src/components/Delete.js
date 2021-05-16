//Delete a selected course
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {deleteCourse,addNotification} from '../store/courseActions'
import {Redirect} from 'react-router-dom'
import '../styles/form.css'

class Delete extends Component {
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
        author: this.props.location.state.course.authorFirstName+" "+this.props.location.state.course.authorLastName
    }
    //Add to the notifications in case of the course was succesfully deleted
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.addNotification("A course you were assigned to has been deleted", this.state)
        this.props.deleteCourse(this.state)
        this.props.history.push('/')
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
    getAssignedTrainers(trainers, currentTrainers){
        var assigned = []
        currentTrainers.forEach(id => {
            for(var i=0; i< trainers.length; i++){
                if (trainers[i].id === id){assigned.push(trainers[i])}
            }
        });
        return assigned
    }
    render() {
        const {auth, users, profile} = this.props;
        const trainers = this.getTrainers(users)
        const currentTrainers = this.getAssignedTrainers(trainers, this.state.trainers)
        //If not signed in redirect to signin page
        if (!auth.uid) return <Redirect to='/signin' />
        //If the logged in user is a trainer redirect to the appropiate trainer page
        if (profile.userType === 'trainer') return <Redirect to='/trainer' />
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
                    <p>Created by: {this.state.author}</p><br/>
                </div>

            </div>
                <form onSubmit={this.handleSubmit} className="template white">
                    <h5 className="grey-text text-darken-3">Delete Course</h5>
                    <div className="input-field">
                        <p>Deleting a course is permanent and can not be undone. would
                        <br/><p>Are you sure you would like to continue?</p></p><br/>
                        <button className="btn cyan lighten-3">Confirm Delete</button>
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
        profile: state.firebase.profile

    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        deleteCourse: (course) => dispatch(deleteCourse(course)),
        addNotification: (notification, course) => dispatch(addNotification(notification, course))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Delete)
