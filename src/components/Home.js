import React, { useEffect, useState } from 'react'
import './styles/Home.css'
import { useNavigate } from 'react-router-dom'
import peopeImg from './img/people.png'
import welcomeImg from './img/welcome.png'

import './styles/Home.css'
function Home() {
    // code for accessing the navigate
    const navigate = useNavigate();
    // useState for toggle welcome message
    const [toggleWelcome, setToggleWelcome] = useState(true);
    // usestate for email add people
    const [userEmailAddPeople, setUserEmailAddPeople] = useState('');

    // usesate for setmsg user is available or not
    const [userFound, setUserFound] = useState(true);

    // function for logout

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    }

    // function for add people chat
    const addPeopleChat = async () => {

    }

    // function for show Message

    const userMessageShownFun = () => {
        setToggleWelcome(false);
    }

    // function for validating the add email user
    const handelEmailAddUser = async (e) => {
        e.preventDefault();
        let login = await fetch('http://localhost:3500/email_validate', {
            method: "POST",
            body: JSON.stringify({ email: userEmailAddPeople }),
            headers: { "Content-Type": "application/json" },
        });

        if (login) {
            login = await login.json();

            if (login.length > 0) {
                setUserFound(false)
            } else {
                setUserFound(true)
            }
        }

    }
    // code for useeffect
    useEffect(() => {
        const auth = localStorage.getItem("userEmail");
        if (!auth) {
            navigate("/login");
        }
    }, [navigate])
    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-3 chatPeople" style={{ padding: '0px', borderRight: '2px solid black' }}>
                        <div className="mainHeader">
                            <p id='profileName'>S</p>
                            {/* code for search people */}
                            <input type="text" placeholder='Search or start new chat' id='searchInput' />
                            {/* code for three dots */}
                            <div className="dropdown">
                                <span className="threedots" data-bs-toggle="dropdown" aria-expanded="false"></span>
                                {/* code for dropdown */}
                                <ul className="dropdown-menu" style={{ backgroundColor: "rgb(17,27,33)", boxShadow: '-1px 1px 1px rgb(32, 44, 51)' }}>
                                    <li data-bs-toggle="modal" data-bs-target="#staticBackdrop"><p className="dropdown-item">Add People</p></li>
                                    <li><p className="dropdown-item">Create Group</p></li>
                                    <hr style={{ border: '1px solid white', margin: '0rem 3px' }} />
                                    <li onClick={() => { logout() }}><p className="dropdown-item" style={{ marginBottom: '5px', marginTop: '3px' }}>Logout</p></li>
                                </ul>
                            </div>
                        </div>

                        {/* code for chat people */}
                        <div className="mainDivPeopleContact">


                            <div className="peopleIdDiv" onClick={() => { userMessageShownFun() }}>
                                <img src={peopeImg} alt="people" className='peopleStyle' />
                                <h1 className='peopleNameTitle'>Sudhanshu Kumar</h1>
                            </div>
                            <hr style={{ border: '1px solid grey', margin: "0px 9px" }} />
                        </div>

                    </div>
                    <div className="col-9 chatShow" style={{ padding: '0px' }}>
                        {toggleWelcome && <div className='welcomeScreenShowChat'>
                            <img src={welcomeImg} alt="chatkit" id='welcomeImg' />
                            <h3 style={{ textAlign: 'center', color: 'white' }}>TalkTime</h3>
                            <p style={{ textAlign: 'center', color: 'grey' }}> Welcome to TalkTime! Dive into meaningful conversations</p>
                        </div>}
                        {/* CODE FOR SEND MESSAGE AND OTHER THINGS PROFILE */}

                        {!toggleWelcome && <><div className="mainHeader" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                            <div style={{ display: 'flex' }}><p id='profileName'>S</p> <h3 style={{ color: "white", fontSize: "15px", marginTop: "28px", marginLeft: "11px" }}>Sudhanshu Kumar</h3></div>

                            {/* code for three dots */}
                            <div className="dropdown">
                                <span className="threedots" data-bs-toggle="dropdown" aria-expanded="false"></span>
                                {/* code for dropdown */}
                                <ul className="dropdown-menu" style={{ backgroundColor: "rgb(17,27,33)", boxShadow: '-1px 1px 1px rgb(32, 44, 51)' }}>
                                    <li><p className="dropdown-item">Delete Chat</p></li>
                                    <li><p className="dropdown-item">Report</p></li>
                                    <hr style={{ border: '1px solid white', margin: '0rem 3px' }} />
                                    <li onClick={() => { logout() }}><p className="dropdown-item" style={{ marginBottom: '5px', marginTop: '3px' }}>Block</p></li>
                                </ul>
                            </div>
                        </div>
                            {/* code for bottom send message */}
                            <div className="sendBottomMsg">
                                <input type="text" id="typeMsgUserStyle" placeholder='Type a message' autoComplete='off' />
                                <i className="fa fa-send" style={{
                                    color: 'white',
                                    border: '1px solid white',
                                    padding: '5px 21px',
                                    borderRadius: '2px'
                                }}></i>
                            </div>
                        </>
                        }
                    </div>
                </div>
            </div>
            {/* CODE FOR MODAL */}
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" >
                    <div className="modal-content" style={{ border: "1px solid grey", }}>
                        <div className="modal-header" style={{ backgroundColor: 'rgb(32,44,51)', color: "white" }}>
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Add People</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" style={{ color: "red" }}></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handelEmailAddUser}>
                                <input type="email" placeholder='Enter user email' className='modalAddInput' onChange={(e) => { setUserEmailAddPeople(e.target.value) }} required />
                                <button type='submit' className='modalAddPeopleBtn'>Add</button>
                            </form>
                        </div>
                        <div className="modal-footer" style={{ backgroundColor: 'rgb(32,44,51)' }}>
                            <p style={{ color: "white", textAlign: 'start' }}>{userFound === false ? "" : "User Not Found"}</p>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>

                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" disabled={userFound} onClick={addPeopleChat}>Start Chat  <i className="fa fa-comment"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
