//Sign in page
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {signIn} from '../store/authActions'
import {Redirect} from 'react-router-dom'
import '../styles/form.css'

class SignIn extends Component {
    state = {
        email: '',
        password: ''
    }
    handleChange = (e) => {
        this.setState({
          [e.target.id]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.signIn(this.state);
    }
    render() {
        const {authError, auth, profile} = this.props;
        //If the signed in user is a scheduler then is redirected to the home page
        if (auth.uid && profile.userType === "scheduler") return <Redirect to='/'/>
        //If the signed in user is a trainer then is redirected to the trainer page
        if (auth.uid && profile.userType === "trainer") return <Redirect to='/trainer'/>
        //If the signed in user is an admin then is redirected to the home page
        if (auth.uid && profile.userType === "admin") return <Redirect to='/'/>
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="template white signin">
                    <h5 className="grey-text text-darken-3">Sign In</h5>
                    <div className="input-field">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" onChange={this.handleChange} required/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" onChange={this.handleChange} required/>
                    </div>
                    <div className="input-field">
                        <button className="btn cyan lighten-3">Login</button>
                        <div className="center">
                            {authError ? <p>{authError}</p> : null}
                        </div>
                        <div className="center">
                            <label>If you do not have an account, contact your department's administrator.</label>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        authError: state.auth.authError,
        auth: state.firebase.auth,
        profile: state.firebase.profile
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        signIn: (creds) => dispatch(signIn(creds))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
