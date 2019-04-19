import React, { useContext } from "react"
import { withRouter } from "react-router-dom"
import { useCookies } from "react-cookie"
import axios from "axios"

import { AppContext } from "../contexts/AppProvider"
import { AuthUserContext } from "../contexts/AuthUserProvider"

import "../styles/NavBar.css"

function NavBar(props) {
  const { authUser, setAuthUser, isUserAuthenticated } = useContext(
    AuthUserContext
  )
  const { backendURL, loading } = useContext(AppContext)
  const [cookies, setCookie, removeCookie] = useCookies()

  function redirect(path) {
    return () => {
      props.history.push(path)
    }
  }

  function isActive(page) {
    const path = props.location.pathname
    if (path === "/") return page === "home"
    else if (path === "/login") return page === "login"
    else if (path === "/register") return page === "register"
    else if (path.startsWith("/dashboard")) return page === "dashboard"
  }

  async function logout() {
    const { sessionId } = cookies.session
    await axios.post(backendURL + "/logout", { sessionId })
    removeCookie("session")
    setAuthUser(null)
    props.history.push("/")
  }

  function loggedInNavBar() {
    return (
      <React.Fragment>
        <div
          className={`navbar-item ${isActive("dashboard") ? "active" : ""}`}
          onClick={redirect("/dashboard/" + authUser)}
        >
          Dashboard
        </div>
        <div className={`navbar-item`} onClick={logout}>
          Log out
        </div>
        {/* <div>Logged in as {authUser}</div> */}
      </React.Fragment>
    )
  }

  function loggedOutNavBar() {
    return (
      <React.Fragment>
        <div
          className={`navbar-item ${isActive("login") ? "active" : ""}`}
          onClick={redirect("/login")}
        >
          Log in
        </div>
        <div
          className={`navbar-item ${isActive("register") ? "active" : ""}`}
          onClick={redirect("/register")}
        >
          Register
        </div>
      </React.Fragment>
    )
  }

  return (
    <div className="navbar">
      <div className="navbar-item-container">
        <div className="name" onClick={redirect("/")}>
          {/* <span>Logo</span> */}
          <span>Reddalert</span>
        </div>
        <div
          className={`navbar-item ${isActive("home") ? "active" : ""}`}
          onClick={redirect("/")}
        >
          Home
        </div>
        {isUserAuthenticated() ? loggedInNavBar() : loggedOutNavBar()}
      </div>
      <div className="color-line" />
    </div>
  )
}

export default withRouter(NavBar)
