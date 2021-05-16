//Pop up windows to manage a selected course
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {Calendar,momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import Modal from "react-bootstrap/Modal";
import{ Button }from 'react-bootstrap'
import '../styles/modal.css'

moment.locale('en-GB');
const localizer = momentLocalizer(moment)

const Cal =(props)=>{

  const handleSelect = (event) => {
    setModalShow(true)
    setEvent(event)
  }

  //Gets the trainers already assigned
  const getAssignedTrainers = (currentTrainers) => {
    var assigned = []
    var trainers = props.trainers
    currentTrainers && currentTrainers.forEach(id => {
        for(var i=0; i< trainers.length; i++){
            if (trainers[i].id === id){assigned.push(trainers[i])}
        }
    });
    return assigned
  }

  //Update the course
  function update (course) {
    props.history.push({
      pathname: '/updatecourse',
      state: {
        course: course
      }
    })
  }

  //Add a trainer
  function add (course) {
    props.history.push({
      pathname: '/addtrainer',
      state: {
        course: course
      }
    })
  }

  //Remove a trainer
  function remove (course) {
    props.history.push({
      pathname: '/removetrainer',
      state: {
        course: course
      }
    })
  }

  //Delete the selected course
  function deleteCourse (course) {
    props.history.push({
      pathname: '/deleteCourse',
      state: {
        course: course
      }
    })
  }

  //Request
  function request (course) {
    props.history.push({
      pathname: '/request',
      state: {
        course: course
      }
    })
  }

  //Display all the details of the selected course
  function courseFormat () {
    var courses = props.courses
    var formattedCourses = []
    var i = 0
    courses && courses.forEach(course => {
      formattedCourses[i] = {
        'id' : course.id,
        'authorFirstName' : course.authorFirstName,
        'authorLastName' : course.authorLastName,
        'authorId' : course.authorId,
        'createdAt' : course.createdAt,
        'title' : course.title,
        'start' : new Date(course.startDate + " " + course.startTime),
        'end' : new Date(course.endDate + " " + course.endTime),
        'description' : course.description,
        'frequency' : course.frequency,
        'author' : course.authorFirstName + " " + course.authorLastName,
        'startDate' : course.startDate,
        'startTime' : course.startTime,
        'endDate' : course.endDate,
        'endTime' : course.endTime,
        'skills' : course.skills,
        'trainers' : course.trainers
      }
      i++
    });
    return formattedCourses
  }
    const [modalShow, setModalShow] = React.useState(false);
    const [event, setEvent] = React.useState("");
    return(
      <React.Fragment>
      <div className = "Cal">
      <Calendar
        //Background color of the course on the calendar
        eventPropGetter={event => ({
          style: {
            backgroundColor: "#80deea",
            color: "black"
          }
        })}
        localizer={localizer}
        events={courseFormat(props)}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        step={30}
        defaultView='month'
        views={['month','week','day']}
        defaultDate={new Date()}
        onSelectEvent={(event)=>handleSelect(event)}
      />

      <MyVerticallyCenteredModal
        show={modalShow}
        course={event}
        type={props.type}
        onHide={() => setModalShow(false)}
      />
      </div>
    </React.Fragment>

    )

    function MyVerticallyCenteredModal (props) {
      var course = props.course
      var trainers = getAssignedTrainers(course.trainers)

      return (
        <Modal
          className="modal"
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Button className="close" onClick={props.onHide}>x</Button>
          <Modal.Body>
            <div className="card">
                <div className="card-content">
                    <span className="card-title">Title: {course.title}</span>
                    <p>Description: {course.description}</p>
                    <p>Frequency: {course.frequency}</p><br/>
                    <p>Start: {course.startDate+" "+course.startTime}</p>
                    <p>End: {course.endDate+" "+course.endTime}</p><br/>
                    <p>Assigned Trainers: </p>
                    <ul>
                      {trainers && trainers.map(trainer => {
                        return <li>{trainer.firstName+" "+trainer.lastName}</li>
                      })}
                    </ul>
                    <p>Created by: {course.author}</p><br/>
                </div>
            </div>
          </Modal.Body>
          {props.type === "trainer" &&
            <div className="footer">
              <Button className="button" onClick={(event)=>request(course)}>Request Change</Button>
            </div>
          }
          {props.type === "scheduler" &&
            <div className="footer">
              <Button className="button" onClick={(event)=>remove(course)}>Remove Trainer</Button>
              <Button className="button" onClick={(event)=>add(course)}>Add Trainer</Button>
              <Button className="button" onClick={(event)=>update(course)}>Update Course</Button>
              <Button className="button" onClick={(event)=>deleteCourse(course)}>Delete Course</Button>
            </div>
          }
          {props.type === "admin" &&
            <div className="footer">
              <Button className="button" onClick={(event)=>deleteCourse(course)}>Delete Course</Button>
            </div>
          }
        </Modal>
      );
    }
}


export default Cal
