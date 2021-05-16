//Add a trainer to an existing course
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {addTrainer, addNotification} from '../store/courseActions'
import {Redirect} from 'react-router-dom'
import '../styles/form.css'

class AddTrainer extends Component {
    state = {
        id: this.props.location.state.course.id,
        title: this.props.location.state.course.title,
        description: this.props.location.state.course.description,
        startDate: this.props.location.state.course.startDate,
        startTime: this.props.location.state.course.startTime,
        endDate: this.props.location.state.course.endDate,
        endTime: this.props.location.state.course.endTime,
        frequency: this.props.location.state.course.frequency,
        author: this.props.location.state.course.author ? this.props.location.state.course.author 
        : this.props.location.state.course.authorFirstName+" "+this.props.location.state.course.authorLastName,
        newTrainer: "",
        skills: '',
        trainers: this.props.location.state.course.trainers,
        selected: false,
        message: ''
    }
    handleChange = (e) => {
        this.setState({
          [e.target.id]: e.target.value
        })
        if(e.target.id === "skills"){
            this.setState({
                selected: true
            })
        }
    }
    //Managing the submit of the form
    handleSubmit = (e) => {
        e.preventDefault();
        var start = Date.parse(this.state.startDate+" "+this.state.startTime)
        var end = Date.parse(this.state.endDate+" "+this.state.endTime)
        var assignedCourses = this.getCourses(this.state.newTrainer, this.props.courses)
        var set = false
        //Check availibility of the trainer before assigning to the course
        assignedCourses.forEach(course => {
            var blockedStart = Date.parse(course.startDate+" "+course.startTime)
            var blockedEnd = Date.parse(course.endDate+" "+course.endTime)
            if((start >= blockedStart && start <= blockedEnd)||(end >= blockedStart && end <= blockedEnd)){
                this.setState({
                    message: "The trainer you have selected is unavailable at this time. Select a new trainer."
                })
                set = true
            }
            else if((blockedStart >= start && blockedStart <= end)||(blockedEnd >= start && blockedEnd <= end)){
                this.setState({
                    message: "The trainer you have selected is unavailable at this time. Select a new trainer."
                })
                set = true
            }
        })
        //Trainner added to the selected course
        if(!set){
            this.props.addNotification("You have been added to an existing course", {...this.state, trainerToNotify: this.state.newTrainer})
            this.props.addTrainer(this.state)
            this.props.history.push('/')
        }
    }
    //Gets all the courses for a trainer
    getCourses = (trainer, courses) =>{
        var trainerCourses = []
        courses && courses.forEach(course => {
            if(course.trainers.includes(trainer)){
                trainerCourses.push(course)
            }
        })

        return trainerCourses
    }
    //Gets all the trainers
    getTrainers = (users) =>{
        var trainers = []
        users && users.forEach(user => {
            if(user.userType === "trainer"){
                trainers.push(user)
            }
        })
        return trainers
    }
    //Gets already assigned trainers
    getAssignedTrainers(trainers, currentTrainers){
        var assigned = []
        currentTrainers.forEach(id => {
            for(var i=0; i< trainers.length; i++){
                if (trainers[i].id === id){assigned.push(trainers[i])}
            }
        });
        return assigned
    }
    //Gets not assigned trainers
    getNotAssignedTrainers(trainers, currentTrainers){
        var not = []
        var notFound
        trainers.forEach(trainer => {
            notFound = true
            currentTrainers.forEach(ctrainer => {
                if(trainer.id === ctrainer.id){
                    notFound = false
                }
            });
            if(notFound){
                not.push(trainer)
            }
        });
        return not
    }
    //Gets the skills of a trainer
    skills = (trainers) => {
        var skills =[]
        trainers && trainers.forEach(trainer => {
            trainer.skills && trainer.skills.forEach(skill => {
                if(!skills.includes(skill.skill)){
                    skills.push(skill.skill)
                }
            });
        });
        return skills
    }
    //Gets the trainers with the selected skill
    trainersWithSkill = (skill, trainers) => {
        var trainersWithSkill =[]
        trainers.forEach(trainer => {
            trainer.skills && trainer.skills.forEach(trainerSkill => {
                if(skill === trainerSkill.skill && !trainersWithSkill.includes(trainer)){
                    trainersWithSkill.push(trainer)
                }
            });
        });
        return trainersWithSkill
    }
    render() {
        const {auth, users, profile} = this.props;
        const trainers = this.getTrainers(users)
        const currentTrainers = this.getAssignedTrainers(trainers, this.state.trainers)
        const notAssignedTrainers = this.getNotAssignedTrainers(trainers, currentTrainers)
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
                    <h5 className="grey-text text-darken-3">Add Trainer</h5>

                    <div className="input-field">
                        <label>Choose a Skill</label><br/><br/>
                        <select id="skills" className="browser-default" onChange={this.handleChange} required>
                            <option value='' disabled selected></option>
                            {this.skills(notAssignedTrainers).map(skill => {
                                return (
                                    <option value={skill}>{skill}</option>
                                )
                            })}
                        </select>
                    </div>

                    {this.state.selected &&
                        <div className="input-field">
                            <label>Choose a Trainer</label><br/><br/>
                            <select id="newTrainer" className="browser-default" onChange={this.handleChange} required>
                                <option value='' selected></option>
                                {this.trainersWithSkill(this.state.skills, notAssignedTrainers).map(trainer => {
                                    return (
                                        <option value={trainer.id}>{trainer.firstName + " " + trainer.lastName}</option>
                                    )
                                })}
                            </select>
                        </div>
                    }

                    {this.state.message !== '' &&
                        <strong className="red-text">{this.state.message}</strong>
                    }

                    <div className="input-field">
                        <button className="btn cyan lighten-3">Add Trainer</button>
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
        addTrainer: (course) => dispatch(addTrainer(course)),
        addNotification: (notification, course) => dispatch(addNotification(notification, course))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTrainer)
