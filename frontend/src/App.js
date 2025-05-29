
import Home from "./Home"
import CenterHomePage from "./CenterHomePage"
<<<<<<< HEAD
import { BrowserRouter, Route, Routes } from "react-router-dom"
=======
import {BrowserRouter,Route,Routes} from "react-router-dom"
>>>>>>> 9d671ee4ee53baa0347d466e712331f353ed920d
import Sidebar from "./EnquiryProcess/Navbar"
import EnquiryTable from "./EnquiryTable"
import MDSidebar from "./MDModule/MDNavbar"
import HoHomePage from "./HOHomePage"
import Login from "./CenterManagers/Login"
import AdmissionSidebar from "./AdmissionProcess/SideBar"
import AdmissionForm from "./AdmissionProcess/Form"
import CMSidebar from "./CenterManagers/CMNavBar"
import EmployeeLoginForm from "./EmployeeLoginForm"
import MdLogin from "./MDModule/MdLogin"
import AdmissionTable from "./MDModule/AdmissionTable"
import AdminNavbar from "./AdminModule/AdminNavbar"
import AllCenterCourses from "./AllCenterCourses"
import ProjectNavBar from "./ProjectsModule/ProjectsNavBar"
import ProjectLogin from "./ProjectsModule/ProjectLogin"
import ProjectDashboard from "./ProjectsModule/Dashboard"
<<<<<<< HEAD
import FranchiseRole from "./Franchise/FranchiseRole"
import FranchiseLogin from "./Franchise/FranchiseLogin"
import FranchiseAdminHome from "./Franchise/FranchiseAdminHome"
import FranchiseAccountantHome from "./Franchise/FranchiseAccountantHome"
import FranchiseUserHome from "./Franchise/FranchiseUserHome"
import FranchiseStoreHome from "./Franchise/FranchiseStoreHome"
import UserPayment from "./Franchise/User/UserPayment"




const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/center-home/:id" element={<CenterHomePage />} />
        <Route path="/ho-home" element={<HoHomePage />} />
        <Route path="/admin/:id" element={<AdminNavbar />} />
        <Route path="/demo" element={<ProjectDashboard />} />
        <Route path="/center/:id" element={<EnquiryTable />} />
        <Route path="/md-navbar/:id" element={<MDSidebar />} />
        <Route path="/manager-login" element={<Login />} />
        <Route path="/enquiry-admission/:id" element={<AdmissionForm />} />
        <Route path="/login/:id" element={<EmployeeLoginForm />} />
        <Route path="/cm-navbar/:id" element={<CMSidebar />} />
        <Route path="/admission-process/:id" element={<AdmissionSidebar />} />
        <Route path="/navbar/:id" element={<Sidebar />} />
        <Route path="/md-login" element={<MdLogin />} />
        <Route path="/admissions/:id" element={<AdmissionTable />} />
        <Route path="/project-navbar/:id" element={<ProjectNavBar />} />
        <Route path="project-login" element={<ProjectLogin />} />
        <Route path="/franchise" element={<FranchiseRole />} />
        <Route path="/franchiseLogin" element={<FranchiseLogin />} />
        <Route path="/franchiseAdminHome" element={<FranchiseAdminHome />} />
        <Route path="/franchiseAccountantHome" element={<FranchiseAccountantHome />} />
        <Route path="/franchiseUserHome" element={<FranchiseUserHome />} />
        <Route path="/franchisePayments" element={<UserPayment />} />
        <Route path="/franchiseStoreHome" element={<FranchiseStoreHome />} />

      </Routes>
    </BrowserRouter>

=======



const App = () =>{
  return(
  <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<Home/>}/>
      <Route path = "/center-home/:id" element = {<CenterHomePage/>}/>
      <Route path = "/ho-home" element = {<HoHomePage/>}/>
      <Route path = "/admin/:id" element = {<AdminNavbar/>}/>
      <Route path = "/demo" element = {<ProjectDashboard/>}/>
      <Route path = "/center/:id" element = {<EnquiryTable/>}/>
      <Route path = "/md-navbar/:id" element = {<MDSidebar/>}/>
      <Route path = "/manager-login" element = {<Login/>}/>
      <Route path  = "/enquiry-admission/:id" element = {<AdmissionForm/>}/>
      <Route path = "/login/:id" element = {<EmployeeLoginForm/>}/>
      <Route path = "/cm-navbar/:id" element = {<CMSidebar/>}/>
      <Route path = "/admission-process/:id" element = {<AdmissionSidebar/>}/>
      <Route path = "/navbar/:id" element = {<Sidebar/>}/>
      <Route path = "/md-login" element = {<MdLogin/>}/>
      <Route path = "/admissions/:id" element={<AdmissionTable/>}/>
      <Route path = "/project-navbar/:id" element = {<ProjectNavBar/>}/>
      <Route path = "project-login" element = {<ProjectLogin/>}/>

   </Routes>
  </BrowserRouter>
   
>>>>>>> 9d671ee4ee53baa0347d466e712331f353ed920d
  )
}

export default App