import React,{useEffect} from 'react';
import { useParams,useNavigate} from 'react-router-dom';
import EnquiryForm from '../EnquiryForm';
import StudentDetailsView from '../StudentDetailsView';
import AllCenterCourses from '../../AllCenterCourses';

const Sidebar = () => {
    const {id} = useParams()
    const navigate = useNavigate();
    useEffect(() => {
        const jwtToken = localStorage.getItem("jwt_token");
        if (!jwtToken) {
            navigate("/");
        }
    }, [navigate]);
    console.log(id)
    const logOut = () =>{
        localStorage.removeItem("jwt_token")
        localStorage.removeItem("center")
        navigate("/")
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
                                <a href="/navbar/enquiry-form" className="nav-link align-middle px-0">
                                    <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Register Student</span>
                                </a>
                            </li>
                            <li>
                                <a href="/navbar/student-details" className="nav-link px-0 align-middle">
                                    <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">View</span> </a>
                            </li>
                            <li>
                                <a href="/navbar/courses" className="nav-link px-0 align-middle">
                                    <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Courses</span> </a>
                            </li>
                        </ul>
                        <hr />
                        <div className="dropdown pb-4">
                        <button onClick={logOut}>Logout</button>
                        </div>
                    </div>
                </div>
                <div className="col py-3" style={{height:"100vh",overflow:"auto"}}>
                 {id === 'enquiry-form' && <EnquiryForm/>}
                 {id === 'student-details' && <StudentDetailsView/>}
                 {id === 'courses' && <AllCenterCourses/>}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
