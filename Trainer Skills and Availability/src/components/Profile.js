//Display the profile page of the logged in user
import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

class Profile extends Component {
    update = (e) => {
        e.preventDefault();
        this.props.history.push('/updateaccount')
    }
    render() {
        const {auth, profile} = this.props;
        //If not signed in redirect to signin page
        if (!auth.uid) return <Redirect to='/signin' />
        return (
            <div className="container">
                <div className="card">
                    <div className="card-content">
                        <h4 className="card-title">Your Profile</h4>
                        <span className="card-title">Name: {profile.firstName+" "+profile.lastName}</span>
                        <p>Email: {auth.email}</p>
                        <p>Phone Number: {profile.phoneNo}</p>
                        <p>Account Type: {profile.userType}</p>
                        {profile.userType === "trainer" &&
                            <div><p>Skills: </p>
                                {profile.skills && profile.skills.map(skill => {
                                    return (
                                        <p>Skill: {skill.skill} - Skill Level: {skill.skillLvl}</p>
                                    )
                                })}
                            </div>}
                        <br/>
                        <form onSubmit={this.update} className="white">
                            <button className="btn cyan lighten-3">Update Account Information</button>
                        </form>
                    </div>
                </div>
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

export default connect(mapStateToProps)(Profile)
