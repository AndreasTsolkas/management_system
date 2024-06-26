import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import Home from "./pages/home/Home";
import SignIn from "./pages/authentication/signIn";
import SignUp from "./pages/authentication/register";
import PasswordForm from "./pages/authentication/password";
import DepartmentForm from "./pages/department/DepartmentForm";
import DepartmentNewForm from "./pages/department/Department.new.Form";
import DepartmentTable from "./pages/department/DepartmentTable";
import DepartmentView from "./pages/department/Department.view";
import EmployeeForm from "./pages/employee/EmployeeForm";
import EmployeeTable from "./pages/employee/EmployeeTable";
import EmployeeView from "./pages/employee/Employee.view";
import PendingEmployeeTable from "./pages/employee/pending.employee.table";
import BonusTable from "./pages/bonus/BonusTable";
import BonusView from "./pages/bonus/Bonus.view";
import VacationRequestForm from "./pages/vacation_request/VacationRequestForm";
import VacationRequestTable from "./pages/vacation_request/VacationRequestTable";
import VacationRequestView from "./pages/vacation_request/VacationRequest.view";
import PendingVacationRequestTable from "./pages/vacation_request/pending.vacationRequest.table";
import UserVacationRequestForm from "./pages/user.vacation.requestForm";
import CreateBonusForm from "./pages/createBonusForm";
import MyProfile from "./pages/profile/profile";
import EditProfileForm from "./pages/profile/profile.edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CookiesProvider } from "react-cookie";
import ScheduledTasks from "src/scheduled-tasks";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Root />
      </>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/department",
        element: <DepartmentTable />,
      },
      {
        path: "/department/edit/:id",
        element: <DepartmentForm />,
      },
      {
        path: "/department/new",
        element: <DepartmentNewForm />,
      },
      {
        path: "/department/view/:id",
        element: <DepartmentView />,
      },
      {
        path: "/employee",
        element: <EmployeeTable />,
      },
      {
        path: "/employee/edit/:id/:profile?",
        element: <EmployeeForm />,
      },
      {
        path: "/employee/new",
        element: <EmployeeForm />,
      },
      {
        path: "/employee/view/:id",
        element: <EmployeeView />,
      },
      {
        path: "/pemployee",
        element: <PendingEmployeeTable />,
      },
      {
        path: "/vacation_request",
        element: <VacationRequestTable />,
      },
      {
        path: "/pvacation_request",
        element: <PendingVacationRequestTable />,
      },
      {
        path: "/vacation_request/new",
        element: <VacationRequestForm />,
      },
      {
        path: "/vacation_request/view/:id",
        element: <VacationRequestView />,
      },
      {
        path: "/bonus",
        element: <BonusTable />,
      },
      {
        path: "/bonus/view/:id",
        element: <BonusView />,
      },
      {
        path: "/uservacationrequest",
        element: <UserVacationRequestForm />,
      },
      {
        path: "/createbonuses",
        element: <CreateBonusForm />,
      },
      {
        path: "/profile",
        element: <MyProfile />,
      },
      {
        path: "/editprofile/:id",
        element: <EditProfileForm />,
      },
      {
        path: "/password/:id",
        element: <PasswordForm />,
      },
    ],
  },
  {
    path: "/signIn",
    element:<SignIn />
  },
  {
    path: "/register",
    element:<SignUp />
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <CookiesProvider defaultSetOptions={{ path: '/' }}>
    <ScheduledTasks />
    <ToastContainer />
    <RouterProvider router={Router} />
  </CookiesProvider>
);