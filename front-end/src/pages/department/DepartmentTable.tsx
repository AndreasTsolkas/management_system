import { GridColDef } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { IPost } from "./department.model";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import * as Important from "src/important";
import * as Display from "src/display";
import {httpClient} from "src/requests";
import {hasAccessAuth} from "src/useAuth";
import { DisplayDataGrid, DisplayTableTitle } from "src/display";

const DepartmentTable = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const adminCookie = Important.adminCookie;
  const isAdmin = JSON.parse(cookies[adminCookie] || 'false');
  const [rows, setRows] = useState<IPost[]>([]);
  const departmentUrl = Important.departmentUrl;
  const [createNewDepartmentButtonDisabled, setCreateNewDepartmentButtonDisabled] = useState<boolean>(false);
  const [deleteDepartmentButtonDisabled, setDeleteDepartmentButtonDisabled] = useState<boolean>(false);
  const [editEmployeeButtonDisabled, setEditEmployeeButtonDisabled] = useState<boolean>(false);
  const [readyToDisplayPage, setReadyToDisplayPage] = useState<boolean>(false);

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
    setReadyToDisplayPage(true);
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
        if(deleteDepartmentButtonDisabled===true) 
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


  function setButtonsDisabled() {
    if(!isAdmin) {
      setCreateNewDepartmentButtonDisabled(true);
      setDeleteDepartmentButtonDisabled(true);
      setEditEmployeeButtonDisabled(true);
    }
  }



  useEffect(() => {
    setButtonsDisabled();
  }, []);

  useEffect(() => {
    getAllDepartments();
  }, []);





  

  return (
    <div style={{marginTop:'50px'}}>
      {readyToDisplayPage ? (
        <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: 900,
        }}
      >
        <DisplayTableTitle text= {'Departments'} />
        <IconButton disabled={createNewDepartmentButtonDisabled} color="primary" onClick={() => navigate(`/department/new`)}>
          <AddIcon />
        </IconButton>
      </div>
      <>
        <DisplayDataGrid rows = {rows ?? []} columns = {columns} />
      </>
      </>
      ) : (
        <>
        {Display.DisplayLoader()}
        </>
      )}
    </div>
  );
};

export default DepartmentTable;