import { Navigate } from "react-router-dom"
import AuthRoute from "../core/Auth/AuthRoute"
import About from "../pages/About/About"
import Calendar from "../pages/Calendar/Calendar"
import CreateTask from "../pages/CreateTask/CreateTask"
import Detail from "../pages/Detail/Detail"
import Group from "../pages/Group/Group"
import List from "../pages/List/List"
import Login from "../pages/Login/Login"
import Profile from "../pages/Profile/Profile"

const routes = [
  {
    path: "/login",
    element: <Login />,
    secured: false,
  },
  {
    path: "/",
    element: <List />,
    secured: true,
  },
  {
    path: "/detail:id",
    element: <Detail />,
    secured: true,
  },
  {
    path: "/newtask",
    element: <CreateTask />,
    secured: true,
  },
  {
    path: "/profile",
    element: <Profile />,
    secured: true,
  },
  {
    path: "/calendar",
    element: <Calendar />,
    secured: true,
  },
  {
    path: "/group/:id",
    element: <Group />,
    secured: true,
  },
  {
    path: "/about",
    element: <About />,
    secured: true,
  },

  {
    path: "*",
    element: <Navigate to="/" />,
    secured: false,
  },
]

export const secureRoute = (component, isSecured) => {
  if (isSecured) return <AuthRoute component={component}/>
  return component
}

export default routes
