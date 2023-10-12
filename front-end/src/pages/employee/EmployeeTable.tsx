import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IPost } from "./employee.model";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import axios from "axios";
import * as Important from "src/important";
import * as Display from "src/display";


const EmployeeTable = () => {
  const isAdmin = false;
  const [rows, setRows] = useState<IPost[]>([]);
  const navigate = useNavigate();
  const employeeTableUrl = Important.backEndEmployeeUrl;
  const employeeGetAll = Important.getAllEmployee;
  const [moreInformationLinkBase, setMoreInformationLinkBase] = useState<string>('');
  const [createNewEmployeeButtonDisabled, setCreateNewEmployeeButtonDisabled] = useState<boolean>(false);

  function setInformationLinkBase() {
    let link = `/employee/view`;
    if(isAdmin) link = `/employee`;
    setMoreInformationLinkBase(link);
  }

  function setCreateNewEmployeeButton() {
    if(!isAdmin) setCreateNewEmployeeButtonDisabled(true);
  }

  useEffect(() => {
    setInformationLinkBase();
  }, []);

  useEffect(() => {
    setCreateNewEmployeeButton();
  }, []);

  useEffect(() => {
    axios
      .get(employeeGetAll)
      .then((response) => {
        const data = response.data;
        setRows(
          data.map(
            (employee: { id: any; employeeUid: number, name: any; surname: any; email: any; startDate: any; vacationDays: any; salary: any; employmentType: any;  department: any;     }) => {
              return {
                id: employee.id,
                employeeUid: employee.employeeUid,
                name: employee.name,
                surName: employee.surname,
                email: employee.email,
                startDate: employee.startDate,
                vacationDays: employee.vacationDays,
                salary: employee.salary,
                employmentType: employee.employmentType,
                employeeDepartment: employee.department.name
              };
            }
          )
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "id", flex: 1 },
    {
      field: "name",
      headerName: "Όνομα",
      flex: 1,
    },
    {
      field: "surName",
      headerName: "Επώνυμο",
      flex: 1,
    },
    {
      field: "employeeUid",
      headerName: "Κωδικός εργαζομένου",
      flex: 1,
    },
      {
        field: "salary",
        headerName: "Μισθός",
        flex: 1,
      },
      {
        field: "employmentType",
        headerName: "Τύπος απασχόλησης",
        flex: 1,
      },
      {
        field: "employeeDepartment",
        headerName: "Τμήμα",
        flex: 1,
      },
    {
      field: "actions",
      headerName: "Ενέργειες",
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <>
            <IconButton 
              color="primary"
              onClick={() => navigate(`${moreInformationLinkBase}/${cellValues?.row?.id}`)}
            >
              <ReadMoreIcon />
            </IconButton>
            <IconButton
              style={{
                color: "red",
              }}
              onClick={() => {
                axios
                  .delete(
                    `${employeeTableUrl}/${cellValues?.row?.id}`
                  )
                  .then(() => {
                    toast.error("deleted!");
                    axios
                      .get(employeeGetAll)
                      .then((response) => {
                        const data = response.data;
                        setRows(
                          data.map(
                            (employee: {
                              id: any;
                              name: any;
                              employeeUid: any;
                              surname: any;
                              email: any;
                              startDate: any;
                              salary: any;
                              vacationDays: any;
                              employmentType: any;
                              department: any;
                            }) => {
                              return {
                                id: employee.id,
                                name: employee.name,
                                employeeUid: employee.employeeUid,
                                surName: employee.surname,
                                email: employee.email,
                                startDate: employee.startDate,
                                vacationDays: employee.vacationDays,
                                salary: employee.salary,
                                employmentType: employee.employmentType,
                                employeeDepartment: employee.department.name
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
        <h2>Λίστα εργαζομένων</h2>
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