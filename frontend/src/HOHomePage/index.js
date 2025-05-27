import "./index.css"
import { IoPersonSharp } from "react-icons/io5";

const HoHomePage = () => {
    return (
        <div className="ho-home-page">
            <nav className="navbar navbar-light" style={{marginLeft:"40px"}}>
                <a class="navbar-brand" href="/">
                    <img src="https://media.licdn.com/dms/image/D560BAQFEeDUK_-l7Rg/company-logo_200_200/0/1681768294128/datapro_solutions_logo?e=2147483647&v=beta&t=VMnJz2SlaAxEm7jeVRC8VD_QLaCbsRANLH8G87RlKqQ" width="100" height="100" alt="home-logo"/>
                </a>
            </nav>
            <div className="ho-home-page-body">
                <a href="/md-login" style={{textDecoration:"none",color:"black"}}>
                    <div className="ho-home-page-card shadow">
                        <IoPersonSharp className="ho-home-page-card-logo"/>
                        <h1>Managing<br/>Directors</h1>
                    </div>
                </a>
                <a href="/co" style={{textDecoration:"none",color:"black"}}>
                    <div className="ho-home-page-card shadow">
                        <IoPersonSharp className="ho-home-page-card-logo"/>
                        <h1>Managers</h1>
                    </div>
                </a>
                <a href="/project-login" style={{textDecoration:"none",color:"black"}}>
                    <div className="ho-home-page-card shadow">
                        <IoPersonSharp className="ho-home-page-card-logo"/>
                        <h1>Projects</h1>
                    </div>
                </a>
            </div>
        </div>
    );
}

export default HoHomePage;
