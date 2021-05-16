//Remove a selected trainer from a course
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {removeTrainer, addNotification} from '../store/courseActions'
import {Redirect} from 'react-router-dom'

class RemoveTrainer extends Component {
    state = {
        id: this.props.location.state.course.id,
        title: this.props.location.state.course.title,
        description: this.props.location.state.course.description,
        startDate: this.props.location.state.course.startDate,
        startTime: this.props.location.state.course.startTime,
        endDate: this.props.location.state.course.endDate,
        endTime: this.props.location.state.course.endTime,
        frequency: this.props.location.state.course.frequency,
        skills: '',
        trainers: this.props.location.state.course.trainers,
        trainer: '',
        author: this.props.location.state.course.authorFirstName+" "+this.props.location.state.course.authorLastName
    }
    handleChange = (e) => {
        this.setState({
          [e.target.id]: e.target.value,
          removable: true
        })
    }
    //Add to the notifications in case of the trainer was succesfully removed from a course
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.addNotification("You have been removed from a course", {...this.state, trainerToNotify: this.state.trainer})
        this.props.removeTrainer(this.state)
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
    //In case the course has only one or 0 trainers assigned then show error message
    getRemovable(currentTrainers){
        if(currentTrainers.length === 1 || currentTrainers.length === 0){
            return 'You must have at least two trainers to remove'
        }
        else{
            return ''
        }
    }
    //Redirect to the page to add a new trainer
    redirect = () =>{
        this.props.history.push({
            pathname: '/addtrainer',
            state: {
              course: this.state
            }
          })
    }
    render() {
        const {auth, users, profile} = this.props;
        const trainers = this.getTrainers(users)
        const currentTrainers = this.getAssignedTrainers(trainers, this.state.trainers)
        const removable = this.getRemovable(currentTrainers)
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
                    <h5 className="grey-text text-darken-3">Remove Trainer</h5>
                    <div className="input-field">
                        {removable === 'You must have at least two trainers to remove' &&
                        <p>{removable}</p>}
                    </div>
                    {removable === '' &&
                    <div className="input-field">
                        <label>Choose a Trainer</label><br/><br/>
                        <select id="trainer" className="browser-default" onChange={this.handleChange} required>
                            <option value="" disabled selected>{removable}</option>
                            {currentTrainers.map(trainer => {
                                return (
                                    <option value={trainer.id}>{trainer.firstName + " " + trainer.lastName}</option>
                                )
                            })}
                        </select>
                    </div>}

                    {removable === 'You must have at least two trainers to remove' &&
                        <div className="input-field">
                            <button type="button" onClick={this.redirect} className="btn cyan lighten-3">Add Trainer</button>
                        </div>
                    }
                    {removable === '' &&
                        <div className="input-field">
                            <button className="btn cyan lighten-3">Remove Trainer</button>
                        </div>
                    }
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
        removeTrainer: (course) => dispatch(removeTrainer(course)),
        addNotification: (notification, course) => dispatch(addNotification(notification, course))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RemoveTrainer)
