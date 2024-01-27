import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IPost } from "./employee.model";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import * as Important from "src/important";
import * as Display from "src/display";
import {hasAccessAuth, isAdminAuth, isAccessTokenNotExpired} from "src/useAuth";
import { useCookies } from "react-cookie";
import { httpClient } from "src/requests";


const EmployeeTable = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const adminCookie = Important.adminCookie;
  const isAdmin = JSON.parse(cookies[adminCookie] || 'false');
  const [rows, setRows] = useState<IPost[]>([]);
  const employeeUrl = Important.employeeUrl;
  const employeeGetAll = Important.getAllEmployee;
  const [createNewEmployeeButtonDisabled, setCreateNewEmployeeButtonDisabled] = useState<boolean>(false);
  const [deleteEmployeeButtonDisabled, setDeleteEmployeeButtonDisabled] = useState<boolean>(false);
  const [editEmployeeButtonDisabled, setEditEmployeeButtonDisabled] = useState<boolean>(false);


  hasAccessAuth();
  isAccessTokenNotExpired();

  function setEmployeeRows(data: any) {
    setRows(
      data.map(
        (employee: { id: any; employeeUid: number, name: any; surname: any; email: any; startDate: any; vacationDays: any; salary: any; employmentType: any;  department: any;     }) => {
          let employeeDepartmentValue = setEmployeeDepartmentValue(employee);
          return {
            id: employee.id,
            name: employee.name,
            surName: employee.surname,
            email: employee.email,
            employmentType: employee.employmentType,
            employeeDepartment: employeeDepartmentValue
          };
        }
      )
    );
  }

  async function getAllEmployees() {
    await httpClient.get(employeeGetAll)
      .then((response) => {
        const data: any  = response.data;
        setEmployeeRows(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "id", flex: 1 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "surName",
      headerName: "Surname",
      flex: 1,
    },
      {
        field: "employmentType",
        headerName: "Employment type",
        flex: 1,
      },
      {
        field: "employeeDepartment",
        headerName: "Department",
        flex: 1,
      },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (cellValues) => {
        let deleteIconDisabled = false;
        let editIconDisabled = false;

        if(deleteEmployeeButtonDisabled===true) 
          deleteIconDisabled = true;

        if(editEmployeeButtonDisabled===true) 
          editIconDisabled = true;
      
        return (
          <>
            <IconButton 
              color="primary"
              onClick={() => navigate(Important.moreInformationLinkBase+cellValues?.row?.id)}
            >
              <ReadMoreIcon />
            </IconButton>
            <IconButton 
    
              color="info"
              disabled={editIconDisabled}
              onClick={() => navigate(Important.editLinkBase+cellValues?.row?.id)}
            >
              <SettingsIcon />
            </IconButton>
            <IconButton
              disabled = {deleteIconDisabled}
              color="warning"
              onClick={async () => {
                await httpClient.delete(
                  `${employeeUrl}/${cellValues?.row?.id}`
                )
                  .then(async () => {
                    toast.info("The employee deleted successfully.");
                    await getAllEmployees();
                  });
              }}
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  function setEmployeeDepartmentValue(employee: any) {
    let employeeDepartmentValue = '-----';
    if (employee.department !== null) employeeDepartmentValue = employee.department.name;
    return employeeDepartmentValue;
  }
  

  function setCreateNewEmployeeButton() {
    if(!isAdmin) {
      setCreateNewEmployeeButtonDisabled(true);
      setDeleteEmployeeButtonDisabled(true);
      setEditEmployeeButtonDisabled(true);
    }
  }

  


  useEffect(() => {
    getAllEmployees();
  }, []);

  useEffect(() => {
    setCreateNewEmployeeButton();
  }, []);



  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: 900,
        }}
      >
        <h2>Employees</h2>
        <IconButton disabled={createNewEmployeeButtonDisabled} color="primary" onClick={() => navigate(`/employee/new`)}>
          <AddIcon />
        </IconButton>
      </div>
      <Box sx={{ height: 500, width: 900 }}>
        {Display.displayDataGrid(rows ?? [], columns)}
      </Box>
    </div>
  );
};

export default EmployeeTable;