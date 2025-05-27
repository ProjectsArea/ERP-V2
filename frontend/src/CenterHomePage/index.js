import { useEffect } from "react";
import "./index.css"
import { IoPersonSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";
const CenterHomePage = () =>{
    const {id} = useParams();
    localStorage.setItem("center", id);
    useEffect(()=>{
        localStorage.removeItem("jwt_token")
    })
    return(
        <div className="center-home-page">
             <nav className="navbar navbar-light" style={{marginLeft:"40px"}}>
            <a class="navbar-brand" href="/">
                <img src="https://media.licdn.com/dms/image/D560BAQFEeDUK_-l7Rg/company-logo_200_200/0/1681768294128/datapro_solutions_logo?e=2147483647&v=beta&t=VMnJz2SlaAxEm7jeVRC8VD_QLaCbsRANLH8G87RlKqQ" width="100" height="100" alt="home-logo"/>
            </a>
            </nav>
            <div className="center-home-page-body">
                <a href = {`/login/FrontOffice`} style={{textDecoration:"none",color:"black"}}>
                    <div className="center-home-page-card shadow">
                        <IoPersonSharp className="center-home-page-card-logo"/>
                        <h1>Front Office</h1>
                    </div>
                </a>
                <a href = "/login/Councillor" style={{textDecoration:"none",color:"black"}}>
                    <div className="center-home-page-card shadow">
                        <IoPersonSharp className="center-home-page-card-logo"/>
                        <h1>Councillor</h1>
                    </div>
                </a>
                <a href = "/manager-login" style={{textDecoration:"none",color:"black"}}>
                    <div className="center-home-page-card shadow">
                        <IoPersonSharp className="center-home-page-card-logo"/>
                        <h1>Center<br/>Manager</h1>
                    </div>
                </a>
                <a href = "/login/Admin" style={{textDecoration:"none",color:"black"}}>
                    <div className="center-home-page-card shadow">
                        <IoPersonSharp className="center-home-page-card-logo"/>
                        <h1>Admin</h1>
                    </div>
                </a>
            </div>
        </div>
    )
}

export default CenterHomePage