import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IPost } from "./vacationRequest.model";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import axios from "axios";
import * as Important from "src/important";
import * as Display from "src/display";
import moment from "moment";
import {hasAccessAuth, isAdminAuth} from "src/useAuth";

const VacationRequestTable = () => {
  const isAdmin = JSON.parse(localStorage.getItem('admin') || 'false');
  const [rows, setRows] = useState<IPost[]>([]);
  const navigate = useNavigate();
  const vacationRequestTable = Important.backEndVacationRequestUrl;
  const vacationRequestUrl = Important.getAllVacationRequest;
  const [moreInformationLinkBase, setMoreInformationLinkBase] = useState<string>('');
  const [createNewVacationRequestButtonDisabled, setCreateNewVacationRequestButtonDisabled] = useState<boolean>(false);
  const [deleteDepartmentButtonDisabled, setDeleteDepartmentButtonDisabled] = useState<boolean>(false);

  hasAccessAuth();


  const columns: GridColDef[] = [
    { field: "id", headerName: "id", flex: 1 },
    {
      field: "employee",
      headerName: "Employee",
      flex: 1,
    },
    {
      field: "startDate",
      headerName: "Start date",
      flex: 1,
    },
    {
      field: "endDate",
      headerName: "End date",
      flex: 1,
    },
    {
        field: "status",
        headerName: "Status",
        flex: 1,
      },
      {
        field: "days",
        headerName: "Days",
        flex: 1,
      },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (cellValues) => {
        let deleteIconDisabled = false;
        if(cellValues?.row?.status==='pending' || deleteDepartmentButtonDisabled===true) {
          deleteIconDisabled = true;
        }
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => navigate(`${moreInformationLinkBase}/${cellValues?.row?.id}`)}
            >
              <ReadMoreIcon />
            </IconButton>
            <IconButton
              disabled={deleteIconDisabled}
              color="warning"
              onClick={() => {
                axios
                  .delete(
                    `${vacationRequestTable}/${cellValues?.row?.id}`
                  )
                  .then(() => {
                    toast.info("Vacation request deleted successfully.");
                    axios
                      .get(vacationRequestUrl)
                      .then((response) => {
                        const data = response.data;
                        setRows(
                          data.map(
                            (vacationRequest: {
                                id: any; 
                                employee: any; 
                                startDate: any; 
                                endDate: any, 
                                status: any, 
                                days: any
                            }) => {
                              return {
                                id: vacationRequest.id,
                                employee: vacationRequest.employee.name,
                                startDate: vacationRequest.startDate,
                                endDate: vacationRequest.endDate, 
                                status: vacationRequest.status, 
                                days: vacationRequest.days
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
  
  function setCreateNewVacationRequestButton() {
    if(!isAdmin) {
      setCreateNewVacationRequestButtonDisabled(true);
      setDeleteDepartmentButtonDisabled(true);
    }
  }

  useEffect(() => {
    setCreateNewVacationRequestButton();
  }, []);

  useEffect(() => {
    setMoreInformationLinkBase('/vacation_request/view');
    axios
      .get(vacationRequestUrl)
      .then((response) => {
        const data = response.data;
        setRows(
          data.map(
            (vacationRequest: { id: any; employee: any; startDate: any; endDate: any, status: any, days: any }) => {
              return {
                id: vacationRequest.id,

                employee: vacationRequest.employee.name+ " "+vacationRequest.employee.surname,
                startDate: moment(vacationRequest.startDate).format('DD / MM / YYYY'),
                endDate: moment(vacationRequest.endDate).format('DD / MM / YYYY'),
                status: vacationRequest.status,
                days: vacationRequest.days,
              };
            }
          )
        );
      })
      .catch((error) => {
        console.error(error);
      });
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
        <h2>Leaves </h2>
        <IconButton disabled={createNewVacationRequestButtonDisabled} color="primary" onClick={() => navigate(`/vacation_request/new`)}>
          <AddIcon />
        </IconButton>
      </div>
      <Box sx={{ height: 500, width: 900 }}>
        {Display.displayDataGrid(rows ?? [], columns)} 
      </Box>
    </div>
  );
};

export default VacationRequestTable;