import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IPost } from "./department.model";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import axios from "axios";
import * as Important from "src/important";
import * as Display from "src/display";

const DepartmentTable = () => {
  const isAdmin = false;
  const [rows, setRows] = useState<IPost[]>([]);
  const navigate = useNavigate();
  const departmentTableUrl = Important.backEndDepartmentUrl;
  const employeeUrl = Important.backEndEmployeeUrl;
  const [moreInformationLinkBase, setMoreInformationLinkBase] = useState<string>('');
  const [createNewDepartmentButtonDisabled, setCreateNewDepartmentButtonDisabled] = useState<boolean>(false);
  const [deleteDepartmentButtonDisabled, setDeleteDepartmentButtonDisabled] = useState<boolean>(false);


  const getAllAndCountOnUser = departmentTableUrl+'/all/countonuser';

  function setInformationLinkBase() {
    let link = `/department/view`;
    if(isAdmin) link = `/department`;
    setMoreInformationLinkBase(link);
  }

  function setCreateNewDepartmentButton() {
    if(!isAdmin) {
      setCreateNewDepartmentButtonDisabled(true);
      setDeleteDepartmentButtonDisabled(true);
    }
  }


  async function getDepartments() {
    axios
      .get(getAllAndCountOnUser)
      .then((response) => {
        const data = response.data;
        
        setRows(
          data.map(
            (department: any) => {
              return {
                id: department.departmentEntityData.id,
                name: department.departmentEntityData.name,
                employeesNum: department.employeesNum,
              };
            }
          )
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }


  /////////////////////

  useEffect(() => {
    setInformationLinkBase();
  }, []);

  useEffect(() => {
    setCreateNewDepartmentButton();
  }, []);

  useEffect(() => {
    getDepartments();
  }, []);





  const columns: GridColDef[] = [
    { field: "id", headerName: "id", flex: 1 },
    {
      field: "name",
      headerName: "Όνομα",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Ενέργειες",
      flex: 0.5,
      renderCell: (cellValues: any) => {
        let deleteIconDisabled = false;
        if(cellValues?.row?.employeesNum > 0 || deleteDepartmentButtonDisabled===true) 
          deleteIconDisabled = true;
        return (
          <>
            <IconButton 
              color="primary"
              onClick={() => navigate(`${moreInformationLinkBase}/${cellValues?.row?.id}`)}
            >
              <ReadMoreIcon />
            </IconButton>
            <IconButton
              disabled ={deleteIconDisabled}
              color="warning"
              onClick={() => {
                axios
                  .delete(
                    `${departmentTableUrl}/${cellValues?.row?.id}`
                  )
                  .then(() => {
                    toast.error("Το τμήμα διαγράφτηκε επιτυχώς.");
                    axios
                      .get(getAllAndCountOnUser)
                      .then((response) => {
                        const data = response.data;
                        setRows(
                          data.map(
                            (department: {
                              id: any;
                              name: any;
                            }) => {
                              return {
                                id: department.id,
                                name: department.name,
                              };
                            }
                          )
                        );
                      })
                      .catch((error) => {
                        console.error(error);
                      });
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
        <h2>Λίστα τμημάτων</h2>
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