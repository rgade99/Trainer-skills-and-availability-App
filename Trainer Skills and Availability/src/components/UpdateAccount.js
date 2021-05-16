//Page to update personal details
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {updateProfile} from '../store/authActions'
import {Redirect} from 'react-router-dom'
import '../styles/form.css'

class UpdateAccount extends Component {
    state = {
        firstName: this.props.profile.firstName,
        lastName: this.props.profile.lastName,
        userType: this.props.profile.userType,
        skills: this.props.profile.skills,
        skill: '',
        removedSkill: '',
        skillLvl: 0,
        phoneNo: this.props.profile.phoneNo,
        isTrainer: false,
        message: '',
        removeMessage: '',
        submitMessage: ''
    }
    handleChange = (e) => {
        this.setState({
          [e.target.id]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        //PhoneNumber
        if(this.state.phoneNo === ''){
            this.state.phoneNo = this.props.profile.phoneNo
        }
        //Check on names
        if(this.state.firstName === '' || this.state.lastName === '' || !this.state.firstName.replace(/\s/g, '').length || !this.state.lastName.replace(/\s/g, '').length){
            this.setState({
                submitMessage: "You must enter a valid name to update"
            })
            return
        }
        //Check if the user is a trainer or a scheduler
        if(this.state.userType === "trainer"){
            var trainerState = {
                userType: this.state.userType,
                id: this.props.auth.uid,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                skills: this.state.skills,
                phoneNo: this.state.phoneNo
            }
            this.props.updateProfile(trainerState)
        }
        else{
            var schedulerState = {
                userType: this.state.userType,
                id: this.props.auth.uid,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                phoneNo: this.state.phoneNo
            }
            this.props.updateProfile(schedulerState)
        }
        this.props.history.push('/profile')
    }
    addSkill = (e) => {
      //Check skill and skill level
        if(this.state.skill === '' || !this.state.skill.replace(/\s/g, '').length || this.state.skillLvl === 0 || this.state.skillLvl === ''){
            this.setState({
                message: "You must enter a valid skill type and skill level to add a skill"
            })
            return
        }
        //Check if skill level is lesser than 1 or greater than 4
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
                message: "Skill added successfully. Remember to press 'Update' to save changes.",
                skill: ''
            })
        }
        else{
            this.setState({
                skills: [...this.state.skills, skill],
                message: "Skill added successfully. Remember to press 'Update' to save changes.",
                skill: ''
            })
        }
    }
    //Remove a skill selected
    removeSkill = (e) => {
        if(this.state.removedSkill === ''){
            this.setState({
                removeMessage: "You must select a skill to remove."
            })
            return
        }
        var skill = this.state.removedSkill
        var skills = [...this.state.skills]
        var index = -1
        for(var i=0; i< skills.length; i++){
            if(skills[i].skill === skill){
                index = i
            }
        }
        if (index !== -1) {
            skills.splice(index, 1);
            this.setState({
                skills: skills,
                removeMessage: "Skill removed successfully. Remember to press 'Update' to save changes."
            })
        }
        else{
            this.setState({
                removeMessage: "Select another skill to remove."
            })
        }

    }
    render() {
        const {auth, profile} = this.props;
        if (!auth.uid) return <Redirect to='/signin' />
        return (
            <div className="container">
                 <div className="card">
                    <div className="card-content">
                        <h4 className="card-title">Your Profile</h4>
                        <span className="card-title">Name: {this.state.firstName+" "+this.state.lastName}</span>
                        <p>Email: {auth.email}</p>
                        <p>Phone Number: {this.state.phoneNo}</p>
                        <p>Account Type: {profile.userType}</p>
                        {profile.userType === "trainer" &&
                            <div><p>Skills: </p>
                                {this.state.skills && this.state.skills.map(skill => {
                                    return (
                                        <p>Skill: {skill.skill} - Skill Level: {skill.skillLvl}</p>
                                    )
                                })}
                            </div>}
                        <br/>
                    </div>
                </div>

                <form onSubmit={this.handleSubmit} className="template white">
                    <h5 className="grey-text text-darken-3">Update Account</h5>
                    <p>Edit as necessary</p>
                    <div className="input-field">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" maxlength="50" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" maxlength="50" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="phoneNo">Phone Number (ex: 12345 123456)</label>
                        <input type="text" id="phoneNo" pattern="[0-9]{5} [0-9]{6}" onChange={this.handleChange}/>
                    </div>


                    {this.state.userType === "trainer" &&
                        <div className="input-field">
                            <h5 className="grey-text text-darken-3">Add a Skill</h5>
                            <div className="input-field">
                                <label htmlFor="skill">Skill Name</label>
                                <input type="text" id="skill" maxlength="50" onChange={this.handleChange}/>
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
                            
                            <h5 className="grey-text text-darken-3">Remove a Skill</h5>
                            <div className="input-field">
                                <label>Skill Name</label><br/>
                                <select id="removedSkill" className="browser-default" onChange={this.handleChange}>
                                    <option value='' disabled selected></option>
                                    {this.state.skills.map(skill => {
                                        return (
                                            <option value={skill.skill}>{skill.skill}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            {this.state.removeMessage !== '' &&
                                <strong className="red-text">{this.state.removeMessage}</strong>
                            }
                            <div className="input-field">
                                <button type="button" className="btn cyan lighten-3" onClick={this.removeSkill} >Remove Skill</button>
                            </div>
                            <hr></hr>
                        </div>
                    }
                    {this.state.submitMessage !== '' &&
                        <strong className="red-text">{this.state.submitMessage}</strong>
                    }
                    <div className="input-field">
                        <button className="btn cyan lighten-3">Update</button>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        auth: state.firebase.auth,
        profile: state.firebase.profile
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        updateProfile: (user) => dispatch(updateProfile(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateAccount)
