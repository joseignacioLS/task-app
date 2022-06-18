import React from "react"
import { Navigate } from "react-router-dom"
import AuthRoute from "../core/Auth/AuthRoute"
import DayView from "../pages/Calendar/MonthView/DayView/DayView"
const About = React.lazy(() => import("../pages/About/About"))
const Calendar = React.lazy(() => import("../pages/Calendar/Calendar"))
const CreateTask = React.lazy(() => import("../pages/CreateTask/CreateTask"))
const Detail = React.lazy(() => import("../pages/Detail/Detail"))
const Group = React.lazy(() => import("../pages/Group/Group"))
const List = React.lazy(() => import("../pages/List/List"))
const Login = React.lazy(() => import("../pages/Login/Login"))
const Profile = React.lazy(() => import("../pages/Profile/Profile"))

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
    path: "/detail/:id",
    element: <Detail />,
    secured: false,
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
    path: "/dayview/:date",
    element: <DayView />,
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
    secured: false,
  },

  {
    path: "*",
    element: <Navigate to="/" />,
    secured: false,
  },
]

export const secureRoute = (component, isSecured) => {
  if (isSecured)
    return (
      <AuthRoute component={<React.Suspense>{component}</React.Suspense>} />
    )
  return <React.Suspense>{component}</React.Suspense>
}

export default routes
