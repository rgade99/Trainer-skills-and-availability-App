//Update a course
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {updateCourse, addNotification} from '../store/courseActions'
import {Redirect} from 'react-router-dom'
import Cal from './Cal'
import moment from 'moment';
import '../styles/form.css'

class UpdateCourse extends Component {
    state = {
        id: this.props.location.state.course.id,
        title: this.props.location.state.course.title,
        description: this.props.location.state.course.description,
        startDate: this.props.location.state.course.startDate,
        startTime: this.props.location.state.course.startTime,
        endDate: this.props.location.state.course.endDate,
        endTime: this.props.location.state.course.endTime,
        frequency: this.props.location.state.course.frequency,
        skills: "",
        trainers: this.props.location.state.course.trainers,
        message: ''
    }
    handleChange = (e) => {
        this.setState({
          [e.target.id]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        //Formatting
        var start = Date.parse(this.state.startDate+" "+this.state.startTime)
        var end = Date.parse(this.state.endDate+" "+this.state.endTime)
        const trainers = this.getTrainers(this.props.users)
        const currentTrainers = this.getAssignedTrainers(trainers, this.state.trainers)
        var assignedCourses = this.getCourses(currentTrainers, this.props.courses)
        var set = false
        //Check if the end time is after the start time
        if(!moment(this.state.endDate+" "+this.state.endTime).isAfter(this.state.startDate+" "+this.state.startTime)){
            this.setState({
                message: "The end time must be after the start time"
            })
            set = true
            return
        }
        //Check if the title is entered
        if(this.state.title === '' || !this.state.title.replace(/\s/g, '').length){
            this.setState({
                message: "You must enter a valid title to update"
            })
            return
        }
        //Check if the description is entered
        if(this.state.description === '' || !this.state.description.replace(/\s/g, '').length){
            this.setState({
                message: "You must enter a valid description to update"
            })
            return
        }
        //Check frequency
        if(this.state.frequency === ''){
            this.setState({
                message: "You must enter a valid frequency to update"
            })
            return
        }
        //Check start time
        if(this.state.startTime === '' || !this.state.startTime.replace(/\s/g, '').length){
            this.setState({
                message: "You must enter a valid start time to update"
            })
            return
        }
        //Check end time
        if(this.state.endTime === '' || !this.state.endTime.replace(/\s/g, '').length){
            this.setState({
                message: "You must enter a valid end time to update"
            })
            return
        }
        //Check availibility of the trainers
        assignedCourses.forEach(course => {
            var blockedStart = Date.parse(course.startDate+" "+course.startTime)
            var blockedEnd = Date.parse(course.endDate+" "+course.endTime)
            if((start >= blockedStart && start <= blockedEnd)||(end >= blockedStart && end <= blockedEnd)){
                this.setState({
                    message: "The date you have entered is unavailable for one of the selected trainers. Try again."
                })
                set = true
            }
            else if((blockedStart >= start && blockedStart <= end)||(blockedEnd >= start && blockedEnd <= end)){
                this.setState({
                    message: "The date you have entered is unavailable for one of the selected trainers. Try again."
                })
                set = true
            }
        })
        //Succesfully updated
        if(!set){
            this.props.addNotification("A course you are assigned to has been updated", this.state)
            this.props.updateCourse(this.state)
            this.props.history.push('/')
        }
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
        currentTrainers.forEach(id => {
            for(var i=0; i< trainers.length; i++){
                if (trainers[i].id === id){assigned.push(trainers[i])}
            }
        });
        return assigned
    }
    //Get the formatted date
    getDate = () => {
        var date = new Date();

        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;

        var today = year + "-" + month + "-" + day;
        return today;
    }
    //Get the courses
    getCourses = (trainers, courses) =>{
        var trainerCourses = []
        trainers.forEach(trainer => {
            courses && courses.forEach(course => {
                if(course.trainers.includes(trainer.id) && !trainerCourses.includes(course) && course.id !== this.state.id){
                    trainerCourses.push(course)
                }
            })
        });
        return trainerCourses
    }
    render() {
        const {auth, users, courses, profile} = this.props;
        const course = this.props.location.state.course
        const trainers = this.getTrainers(users)
        const currentTrainers = this.getAssignedTrainers(trainers, this.state.trainers)
        var trainerCourses = this.getCourses(currentTrainers, courses)


        if (!auth.uid) return <Redirect to='/signin' />
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
                        <p>Created by: {course.author}</p><br/>
                    </div>
                </div>
                <form onSubmit={this.handleSubmit} className="template white">
                    <h5 className="grey-text text-darken-3">Update Course</h5>
                    <p>Edit as necessary</p>
                    <div className="input-field">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" maxlength="50" onChange={this.handleChange}/>
                    </div>

                    <div className="input-field">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" className="materialize-textarea" maxlength="500" onChange={this.handleChange}></textarea>
                    </div>

                    <div className="input-field">
                        <label htmlFor="frequency">Frequency</label>
                        <input type="number" id="frequency" name="quantity" min="1" max="10" onChange={this.handleChange}></input>
                    </div>

                    <div className="input-field">
                        <h5 className="grey-text text-darken-3">Choose a Time</h5>
                        <p>The assigned trainers are not available during these times:</p>
                        <div className="unavailable">
                            <Cal courses={trainerCourses} trainers={trainers} history={this.props.history}/>
                        </div>
                    </div>

                    <div className="input-field">
                    <label htmlFor="startDate">Start date</label><br/><br/>
                    <input type="date" id="startDate" min={this.getDate()}
                        onChange={this.handleChange} ></input>
                    </div>

                    <div className="input-field">
                        <label htmlFor="startTime">Start Time (ex: 14:30)</label>
                        <input type="text" id="startTime" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" onChange={this.handleChange} ></input>
                    </div>

                    <div className="input-field">
                        <label htmlFor="endDate">End date</label><br/><br/>
                        <input type="date" id="endDate" min={this.state.startDate}
                            onChange={this.handleChange} ></input>
                    </div>

                    <div className="input-field">
                        <label htmlFor="endTime">End Time (after start time)</label>
                        <input type="text" id="endTime" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" onChange={this.handleChange} ></input>
                    </div>

                    {this.state.message !== '' &&
                        <strong className="red-text">{this.state.message}</strong>
                    }

                    <div className="input-field">
                        <button className="btn cyan lighten-3"  onClick={this.checkTime}>Update</button>
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
        courses: state.firestore.ordered.courses,
        profile: state.firebase.profile
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        updateCourse: (course) => dispatch(updateCourse(course)),
        addNotification: (notification, course) => dispatch(addNotification(notification, course))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateCourse)
