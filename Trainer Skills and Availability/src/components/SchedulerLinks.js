//Sets the link for the user type Scheduler
import React from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux'
import { signOut } from '../store/authActions';
import '../styles/navLink.css';

const SchedulerLinks = (props) => {
    //Links for the Scheduler page navbar
    return(
        <ul className="right hide-on-med-and-down">
            <li><NavLink to='/create' className='navLink'>Create Course</NavLink></li>
            <li><NavLink to='/updates' className='navLink'>View Requests</NavLink></li>
            <li><NavLink to='/contact' className='navLink'>Contact Information</NavLink></li>
            <li><a className='navLink' onClick={props.signOut}>Log Out</a></li>
            <li><NavLink to='/profile' className='btn btn-floating green lighten-1'>
            {props.profile.initials}
            </NavLink></li>
        </ul>
    )
}

//Dispatch signOut props
const mapDispatchToProps = (dispatch) => {
    return{
        signOut: () => dispatch(signOut())
    }
}

export default connect(null, mapDispatchToProps)(SchedulerLinks)
