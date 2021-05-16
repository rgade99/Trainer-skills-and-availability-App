//Signup page
import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {signUp} from '../store/authActions'
import '../styles/form.css'

class SignUp extends Component {
    state = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        userType: '',
        skills: [],
        skill: '',
        skillLvl: 0,
        phoneNo: '',
        isTrainer: false,
        message: '',
        successMessage: ''
    }
    handleChange = (e) => {
        this.setState({
          [e.target.id]: e.target.value
        })
        //If trainer is selected as user type
        if(e.target.id === "userType" && e.target.value === "trainer"){
            this.setState({
                isTrainer: true
            })
        }
        //If trainer is not selected as user type
        else if(e.target.id === "userType" && e.target.value !== "trainer"){
            this.setState({
                isTrainer: false
            })
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        //Check name
        if(!this.state.firstName.replace(/\s/g, '').length || !this.state.lastName.replace(/\s/g, '').length){
            this.setState({
                successMessage: "You must enter a valid name"
            })
            return
        }
        //Check password
        if(!this.state.password.replace(/\s/g, '').length || this.state.password.length < 6){
            this.setState({
                successMessage: "You must enter a password with at least 6 characters"
            })
            return
        }
        //If the user type selected is a trainer then atleast a skill needs to be entered/selected
        if(this.state.userType === "trainer"){
            if(this.state.skills.length === 0){
                this.setState({
                    successMessage: "You must have at least 1 skill to create a new trainer."
                })
                return
            }
            var trainerState = {
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                userType: this.state.userType,
                skills: this.state.skills,
                phoneNo: this.state.phoneNo
            }
            this.props.signUp(trainerState)
        }
        else{
            var schedulerState = {
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                userType: this.state.userType,
                phoneNo: this.state.phoneNo
            }
            this.props.signUp(schedulerState)
        }
    }
    addSkill = (e) => {
      //If skill field is empty or the level is zero
        if(this.state.skill === '' || this.state.skillLvl === 0 || this.state.skillLvl === ''){
            this.setState({
                message: "You must enter a skill type and skill level to add a skill"
            })
            return
        }
        //If the skill level is lesser than 1 or greater than 4
        else if(this.state.skillLvl < 1 || this.state.skillLvl > 4){
            this.setState({
                message: "You must enter a skill level from 1 to 4"
            })
            return
        }
        var skill = {skill: this.state.skill, skillLvl: this.state.skillLvl}
        if(this.state.skills.length === 0){
            this.setState({
                skills: [skill],
                message: "Skill added successfully.",
                skill: ''
            })
        }
        else{
            this.setState({
                skills: [...this.state.skills, skill],
                message: "Skill added successfully.",
                skill: ''
            })
        }
    }
    render() {
        const {auth, authError, profile} = this.props;
        if (profile.userType === 'trainer') return <Redirect to='/trainer' />
        if (profile.userType === 'scheduler') return <Redirect to='/' />
        if (!auth.uid) return <Redirect to='/signin'/>
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="template white create">
                    <h5 className="grey-text text-darken-3">New User Details</h5>
                    <div className="input-field">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" maxlength="50" onChange={this.handleChange} required/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" maxlength="50" onChange={this.handleChange} required/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="phoneNo">Phone Number (ex: 12345 123456)</label>
                        <input type="text" id="phoneNo" pattern="[0-9]{5} [0-9]{6}" onChange={this.handleChange} required/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" maxlength="50" onChange={this.handleChange} required/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" maxlength="50" onChange={this.handleChange} required/>
                    </div>
                    <div className="input-field">
                        <label>User Type</label><br/><br/>
                        <select id="userType" className="browser-default" onChange={this.handleChange} required>
                            <option value="" disabled selected>Choose your user type</option>
                            <option value="scheduler">Scheduler</option>
                            <option value="trainer">Trainer</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>


                    {this.state.isTrainer &&
                        <div className="input-field">
                            <h5 className="grey-text text-darken-3">Add a Skill</h5>

                            <div className="card">
                                <div className="card-content">
                                    <span className="card-title">Currently Registered Skills</span>
                                        {this.state.skills && this.state.skills.map(skill => {
                                            return (
                                                <p>Skill: {skill.skill} - Skill Level: {skill.skillLvl}</p>
                                            )
                                        })}
                                </div>
                            </div>

                            <div className="input-field">
                                <label htmlFor="skill">Skill Name</label>
                                <input type="text" id="skill" maxlength="50" onChange={this.handleChange} />
                            </div>

                            <div className="input-field">
                                <label htmlFor="skillLvl">Skill Level</label>
                                <input type="number" id="skillLvl" onChange={this.handleChange}></input>
                            </div>

                            {this.state.message !== '' &&
                                <strong className="red-text">{this.state.message}</strong>
                            }

                            <div className="input-field">
                                <button type="button" className="btn cyan lighten-3" onClick={this.addSkill} >Add Skill</button>
                            </div>
                            <hr></hr>
                        </div>
                    }
                    {this.state.successMessage !== '' &&
                        <strong className="red-text">{this.state.successMessage}</strong>
                    }
                    <div className="input-field">
                        <button className="btn cyan lighten-3">Create User</button>
                        <div className="center">
                            {authError ? <p>{authError}</p> : null}
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        auth: state.firebase.auth,
        authError: state.auth.authError,
        profile: state.firebase.profile
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        signUp: (newUser) => dispatch(signUp(newUser))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
