import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";
import { IPost } from "./department.model";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import axios from "axios";
import * as Important from "src/important";
import * as Display from "src/display";
import {httpClient} from "src/requests";
import {hasAccessAuth} from "src/useAuth";

const DepartmentTable = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const adminCookie = Important.adminCookie;
  const isAdmin = JSON.parse(cookies[adminCookie] || 'false');
  const [rows, setRows] = useState<IPost[]>([]);
  const departmentUrl = Important.departmentUrl;
  const departmentGetAll = Important.getAllDepartment;
  const employeeUrl = Important.backEndEmployeeUrl;
  const [createNewDepartmentButtonDisabled, setCreateNewDepartmentButtonDisabled] = useState<boolean>(false);
  const [deleteDepartmentButtonDisabled, setDeleteDepartmentButtonDisabled] = useState<boolean>(false);
  const [editEmployeeButtonDisabled, setEditEmployeeButtonDisabled] = useState<boolean>(false);

  const getAllAndCountOnUserBaseUrl = Important.getAllAndCountOnUserBaseUrl;


  hasAccessAuth();

  function setDepartmentRows(data: any) {
    setRows(
      data.map(
         (item: any) => {
          return {
            id: item.departmentEntityData.id,
            name: item.departmentEntityData.name,
            employeesNum: item.employeesNum
          };
        }
      )
    );
  }

  async function getAllDepartments() {
    await httpClient.get(getAllAndCountOnUserBaseUrl)
      .then((response) => {
        const data = response.data;
        setDepartmentRows(data);
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
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (cellValues: any) => {
        let deleteIconDisabled = false;
        let editIconDisabled = false;
        if(cellValues?.row?.employeesNum > 0 || deleteDepartmentButtonDisabled===true) 
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
              disabled= {editIconDisabled}
              color="info"
              onClick={() => navigate(Important.editLinkBase+cellValues?.row?.id)}
            >
              <SettingsIcon />
            </IconButton>
            <IconButton
              disabled ={deleteIconDisabled}
              color="warning"
              onClick={async () => {
                 await httpClient.delete(
                    `${departmentUrl}/${cellValues?.row?.id}`
                  )
                  .then(async () => {
                    toast.info("Department deleted successfully.");
                     await getAllDepartments();
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


  function setCreateNewDepartmentButton() {
    if(!isAdmin) {
      setCreateNewDepartmentButtonDisabled(true);
      setDeleteDepartmentButtonDisabled(true);
    }
  }


  



  useEffect(() => {
    setCreateNewDepartmentButton();
  }, []);

  useEffect(() => {
    getAllDepartments();
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
        <h2>Departments</h2>
        <IconButton disabled={createNewDepartmentButtonDisabled} color="primary" onClick={() => navigate(`/department/new`)}>
          <AddIcon />
        </IconButton>
      </div>
      <Box sx={{ height: 500, width: 900 }}>
        {Display.displayDataGrid(rows ?? [], columns)}
      </Box>
    </div>
  );
};

export default DepartmentTable;