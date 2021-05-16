//Sets the link for the user type Admin
import React from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux'
import { signOut } from '../store/authActions';
import '../styles/navLink.css';

const AdminLinks = (props) => {
    //Links for the Admin page navbar
    return(
        <ul className="right hide-on-med-and-down">
            <li><NavLink to='/signup' className='navLink'>Add New User</NavLink></li>
            <li><NavLink to='/contact' className='navLink'>Contact Information</NavLink></li>
            <li><a className='navLink' onClick={props.signOut}>Log Out</a></li>
            <li><NavLink to='/profile' className='btn btn-floating red lighten-1'>
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

export default connect(null, mapDispatchToProps)(AdminLinks)
