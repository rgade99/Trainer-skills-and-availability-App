//Check the details of all the trainers and schedulers
import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

class Contact extends Component {
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
    //Gets all the schedulers
    getSchedulers = (users) =>{
        var schedulers = []
        users && users.forEach(user => {
            if(user.userType === "scheduler"){
                schedulers.push(user)
            }
        })
        return schedulers
    }
    render() {
        const {auth, users} = this.props;
        const trainers = this.getTrainers(users)
        const schedulers = this.getSchedulers(users)
        //If not signed in redirect to signin page
        if (!auth.uid) return <Redirect to='/signin' />
        return (
            <div className="container">
                <div className="card">
                    <div className="card-content">
                        <h4 className="card-title">Scheduler Contacts</h4>
                        {schedulers.map(scheduler => {
                                return (
                                    <div className="card">
                                        <div className="card-content">
                                            <span className="card-title">Name: {scheduler.firstName+ " " +scheduler.lastName}</span>
                                            <p>Email: {scheduler.email}</p>
                                            <p>Phone Number: {scheduler.phoneNo}</p>
                                        </div>
                                    </div>
                                )
                        })}
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                        <h4 className="card-title">Trainer Contacts</h4>
                        {trainers.map(trainer => {
                                return (
                                    <div className="card">
                                        <div className="card-content">
                                            <span className="card-title">Name: {trainer.firstName+ " " +trainer.lastName}</span>
                                            <p>Email: {trainer.email}</p>
                                            <p>Phone Number: {trainer.phoneNo}</p>
                                            <p>Skills: </p>
                                            <ul>
                                                {trainer.skills.map(skill => {
                                                        return (
                                                            <li>Skill: {skill.skill} - Skill Level: {skill.skillLvl}</li>
                                                        )
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        auth: state.firebase.auth,
        users: state.firestore.ordered.users
    }
}

export default connect(mapStateToProps)(Contact)
