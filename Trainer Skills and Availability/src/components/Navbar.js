//Sets the top navbar with appropiate links
import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import SchedulerLinks from './SchedulerLinks';
import TrainerLinks from './TrainerLinks';
import AdminLinks from './AdminLinks'
import SignedOut from './SignedOut';
import {connect} from 'react-redux'
import '../styles/form.css'

//Checks the type of user logged in and sets the vorrect navbar links
class Navbar extends Component {
    checkUser = (auth, profile) => {
      //In case it is a scheduler then it returns the links in navbar appropriate for the user
        if(auth.uid && profile.userType === "scheduler"){
            return <SchedulerLinks profile={profile}/>
        }
        //In case it is a trainer then it returns the links in navbar appropriate for the user
        else if(auth.uid && profile.userType === "trainer") {
            return <TrainerLinks profile={profile}/>
        }
        //In case it is an admin then it returns the links in navbar appropriate for the user
        else if(auth.uid && profile.userType === "admin") {
            return <AdminLinks profile={profile}/>
        }
        else{
            //Log out link
            return <SignedOut />
        }
    }
    render(){
        const {auth, profile} = this.props;
        const links = this.checkUser(auth, profile)
        return(
          //Home button with the name of the app
          <nav>
              <div className="nav-wrapper cyan lighten-3">
                <Link to='/' className="brand-logo left">Course Schedule Helper</Link>
                  {auth.isLoaded && links}
              </div>
          </nav>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        auth: state.firebase.auth,
        profile: state.firebase.profile
    }
}

export default connect(mapStateToProps)(Navbar)
