import React, { useState, useEffect } from 'react'
import './styles/Account.css'
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Login() {
    // code for usestate
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // code for accessing the usenavigate
    const navigate = useNavigate();
    // code for notify
    const notify = (msg) =>
        toast.error(msg, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    // code for handle submit login
    const handleLogin = async (e) => {
        e.preventDefault();
        let login = await fetch('http://localhost:3500/login', {
            method: "POST",
            body: JSON.stringify({ email: email, password: password }),
            headers: { "Content-Type": "application/json" },
        });

        if (login) {
            login = await login.json();

            if (login === true) {
                localStorage.setItem("userEmail", email);
                navigate("/");
            } else {
                notify(login.errMsg);
            }
        }
    }
    // code for useeffect
    useEffect(() => {
        const auth = localStorage.getItem("userEmail");
        if (auth) {
            navigate("/");
        }
    })
    return (
        <>
            <section className="background-radial-gradient overflow-hidden">
                <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
                    <div className="row gx-lg-5 align-items-center mb-5">
                        <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: "10" }}>
                            <h1 className="my-5 display-5 fw-bold ls-tight" style={{ color: "hsl(218, 81%, 95%)" }}>
                                TalkTime <br />
                                <span style={{ color: "hsl(218, 81%, 75%)" }}>Your Personal Chat</span>
                            </h1>
                            <p className="mb-4 opacity-70" style={{ color: "hsl(218, 81%, 85%)" }}>
                                Welcome to TalkTime! Dive into meaningful conversations, make new connections, and discover a world of endless possibilities through chat.
                            </p>
                        </div>

                        <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
                            <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                            <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

                            <div className="card bg-glass">
                                <div className="card-body px-4 py-5 px-md-5">
                                    <form onSubmit={handleLogin}>
                                        <div className="form-outline mb-4">
                                            <input type="email" id="form3Example3" className="form-control" required autoComplete='off' value={email} onChange={(e) => { setEmail(e.target.value) }} />
                                            <label className="form-label" htmlFor="form3Example3">Email address</label>
                                        </div>

                                        <div className="form-outline mb-4">
                                            <input type="password" id="form3Example4" className="form-control" required pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" autoComplete='off' value={password} onChange={(e) => { setPassword(e.target.value) }} title='Password must be 8 mix of 8 digits' />
                                            <label className="form-label" htmlFor="form3Example4">Password</label>
                                        </div>
                                        <button type="submit" className="btn btn-info btn-block mb-4">
                                            Login &rarr;
                                        </button>
                                    </form>
                                    <div className="form-outline mb-4 d-flex flex-column justify-content-center">
                                        <p className='text-center mt-1'>New Account</p>

                                        <button className="btn btn-danger btn-block mb-4" style={{ width: '50%', alignSelf: 'center' }} onClick={() => { navigate('/account') }}>
                                            Sign up &rarr;
                                        </button>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer />
        </>
    )
}

export default Login
