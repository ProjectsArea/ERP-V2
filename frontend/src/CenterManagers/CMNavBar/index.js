import React,{useEffect} from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import RegisterEmployees from '../RegisterEmployes';
import EmployeeList from '../EmployeeList';
import CenterEnquiry from '../CenterEnquiry';
import StudentJoiningStatus from '../StudentJoiningStatus';
import AllCourses from '../AllCourses';
import CenterCourses from '../CenterCourses';
//import StudentDetailsView from '../StudentDetailsView';
// import Centers from '../Centers';
// import ManagerRegistration from '../ManagerRegistration';
// import EnquiresAndAdmissions from '../EnquiresAndAdmissions';

const CMSidebar = () => {
    const {id} = useParams()
    const navigate = useNavigate();
    const center = localStorage.getItem("center");
    const logOut = () =>{
        localStorage.removeItem("jwt_token")
        localStorage.removeItem("center")
        navigate("/")
    }
    useEffect(() => {
        const jwtToken = localStorage.getItem("jwt_token");
        if (!jwtToken) {
            navigate("/");
        }
    }, [navigate]);
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
                                <a href={`/cm-navbar/${center}`} className="nav-link align-middle px-0">
                                    <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Enquiries</span>
                                </a>
                            </li>
                            <li>
                                <a href="/cm-navbar/employee-list" className="nav-link px-0 align-middle">
                                    <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Employee List</span> </a>
                            </li>
                            <li>
                                <a href="/cm-navbar/enquiry-status" className="nav-link px-0 align-middle">
                                    <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Enquiry Status</span> </a>
                            </li>
                            <li>
                                <a href="/cm-navbar/all-courses" className="nav-link px-0 align-middle">
                                    <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">All Courses</span> </a>
                            </li>
                            <li>
                                <a href="/cm-navbar/center-courses" className="nav-link px-0 align-middle">
                                    <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Center Courses</span> </a>
                            </li>
                            <li>
                                <a href="/cm-navbar/register-employee" className="nav-link px-0 align-middle">
                                    <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Register Employee</span> </a>
                            </li>
                        </ul>
                        <hr />
                        <div className="dropdown pb-4">
                        <button onClick={logOut}>Logout</button>
                        </div>
                    </div>
                </div>
                <div className="col py-3" style={{height:"100vh",overflow:"auto"}}>
                {id === center && <CenterEnquiry/>}
                 {id === 'register-employee' && <RegisterEmployees/>}
                 {id === "employee-list" && <EmployeeList/>}
                 {id === "enquiry-status" && <StudentJoiningStatus/>}
                 {id  === "all-courses" && <AllCourses/>}
                 {id  === "center-courses" && <CenterCourses/>}
                </div>
            </div>
        </div>
    );
}

export default CMSidebar;
