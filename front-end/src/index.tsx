import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import Home from "./pages/home/Home";
import Error from "./pages/error/Error";
import DepartmentForm from "./pages/department/DepartmentForm";
import DepartmentTable from "./pages/department/DepartmentTable";
import EmployeeForm from "./pages/employee/EmployeeForm";
import EmployeeTable from "./pages/employee/EmployeeTable";
import BonusForm from "./pages/bonus/BonusForm";
import BonusTable from "./pages/bonus/BonusTable";
import VacationRequestForm from "./pages/vacation_request/VacationRequestForm";
import VacationRequestTable from "./pages/vacation_request/VacationRequestTable";
import PendingVacationRequestTable from "./pages/vacation_request/PendingVacationRequestTable";
import VacationRequestForm2 from "./pages/vacation.requestForm";
import VacationRequestAcceptForm from "./pages/vacation.request.acceptForm";
import CreateBonusForm from "./pages/createBonusForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Root />
        <ToastContainer />
      </>
    ),
    errorElement: <Error />,
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
        path: "/department/:id",
        element: <DepartmentForm />,
      },
      {
        path: "/department/new",
        element: <DepartmentForm />,
      },
      {
        path: "/employee",
        element: <EmployeeTable />,
      },
      {
        path: "/employee/:id",
        element: <EmployeeForm />,
      },
      {
        path: "/employee/new",
        element: <EmployeeForm />,
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
        path: "/vacation_request/:id",
        element: <VacationRequestForm />,
      },
      {
        path: "/vacation_request/new",
        element: <VacationRequestForm />,
      },
      {
        path: "/bonus",
        element: <BonusTable />,
      },
      {
        path: "/bonus/:id",
        element: <BonusForm />,
      },
      {
        path: "/bonus/new",
        element: <BonusForm />,
      },
      {
        path: "/vacationrequest",
        element: <VacationRequestForm2 />,
      },
      {
        path: "/acceptvacation",
        element: <VacationRequestAcceptForm />,
      },
      {
        path: "/createbonuses",
        element: <CreateBonusForm />,
      },
      
    ],
    
  },]
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <RouterProvider router={Router} />
    <ToastContainer />
  </>
);