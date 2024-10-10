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
import Layout from "src/layout";

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
        element: (
          <Layout>
            <Home />
          </Layout>
        ),
      },
      {
        path: "/department",
        element: (
          <Layout>
            <DepartmentTable />
          </Layout>
        ),
      },
      {
        path: "/department/edit/:id",
        element: (
          <Layout>
            <DepartmentForm />
          </Layout>
        ),
      },
      {
        path: "/department/new",
        element: (
          <Layout>
            <DepartmentNewForm />
          </Layout>
        ),
      },
      {
        path: "/department/view/:id",
        element: (
          <Layout>
            <DepartmentView />
          </Layout>
        ),
      },
      {
        path: "/employee",
        element: (
          <Layout>
            <EmployeeTable />
          </Layout>
        ),
      },
      {
        path: "/employee/edit/:id/:profile?",
        element: (
          <Layout>
            <EmployeeForm />
          </Layout>
        ),
      },
      {
        path: "/employee/new",
        element: (
          <Layout>
            <EmployeeForm />
          </Layout>
        ),
      },
      {
        path: "/employee/view/:id",
        element: (
          <Layout>
            <EmployeeView />
          </Layout>
        ),
      },
      {
        path: "/pemployee",
        element: (
          <Layout>
            <PendingEmployeeTable />
          </Layout>
        ),
      },
      {
        path: "/vacation_request",
        element: (
          <Layout>
            <VacationRequestTable />
          </Layout>
        ),
      },
      {
        path: "/pvacation_request",
        element: (
          <Layout>
            <PendingVacationRequestTable />
          </Layout>
        ),
      },
      {
        path: "/vacation_request/new",
        element: (
          <Layout>
            <VacationRequestForm />
          </Layout>
        ),
      },
      {
        path: "/vacation_request/view/:id",
        element: (
          <Layout>
            <VacationRequestView />
          </Layout>
        ),
      },
      {
        path: "/bonus",
        element: (
          <Layout>
            <BonusTable />
          </Layout>
        ),
      },
      {
        path: "/bonus/view/:id",
        element: (
          <Layout>
            <BonusView />
          </Layout>
        ),
      },
      {
        path: "/uservacationrequest",
        element: (
          <Layout>
            <UserVacationRequestForm />
          </Layout>
        ),
      },
      {
        path: "/createbonuses",
        element: (
          <Layout>
            <CreateBonusForm />
          </Layout>
        ),
      },
      {
        path: "/profile",
        element: (
          <Layout>
            <MyProfile />
          </Layout>
        ),
      },
      {
        path: "/editprofile/:id",
        element: (
          <Layout>
            <EditProfileForm />
          </Layout>
        ),
      },
      {
        path: "/password/:id",
        element: (
          <Layout>
            <PasswordForm />
          </Layout>
        ),
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