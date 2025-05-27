import React from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import WalkIns from '../Walkins';
import ProjectAdmission from '../Admission';
import JoinedAdmission from '../JoinedAdmissions';
import ProjectDashboard from '../Dashboard';


const ProjectNavBar = () => {
    const {id} = useParams()
    const navigate = useNavigate();
    const logout = () =>{
        navigate("/");
    }
    return (
        <div className="container-fluid" style={{height:"100vh"}}>
            <div className="row flex-nowrap">
                <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark" style={{height:"100vh"}}>
                    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                        <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                            <span className="fs-5 d-none d-sm-inline">Datapro<br/>Computers</span>
                        </a>
                        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                            <li className="nav-item">
                                <a href="/project-navbar/enquiry" className="nav-link align-middle px-0">
                                    <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Enquiries</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/project-navbar/admission" className="nav-link align-middle px-0">
                                    <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Admission</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/project-navbar/reviews" className="nav-link align-middle px-0">
                                    <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Review</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/project-navbar/dashboard" className="nav-link align-middle px-0">
                                    <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Dashboard</span>
                                </a>
                            </li>
                            
                        </ul>
                        <hr />
                        <div className="dropdown pb-4">
                          <button onClick = {logout}>Logout</button>
                        </div>
                    </div>
                </div>
                <div className="col py-3" style={{height:"100vh",overflow:"auto"}}>
                {id === "enquiry" && <WalkIns/>}
                {id === "admission" && <ProjectAdmission/>}
                {id === "reviews" && <JoinedAdmission/>}
                {id === "dashboard" && <ProjectDashboard/>}
                </div>
            </div>
        </div>
    );
}

export default ProjectNavBar;
