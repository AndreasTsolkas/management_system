import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IPost } from "./vacationRequest.model";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import * as Important from "src/important";
import * as Display from "src/display";
import * as Datetime from "src/datetime";
import {hasAccessAuth, isAccessTokenNotExpired} from "src/useAuth";
import { useCookies } from "react-cookie";
import { httpClient } from "src/requests";
import { DisplayDataGrid, DisplayLoader, DisplayTableTitle } from "src/display";

const VacationRequestTable = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const adminCookie = Important.adminCookie;
  const isAdmin = JSON.parse(cookies[adminCookie] || 'false');
  const [rows, setRows] = useState<IPost[]>([]);
  const vacationRequestUrl = Important.vacationRequestUrl;
  const vacationRequesGetAll = Important.getAllVacationRequest;
  const [moreInformationLinkBase, setMoreInformationLinkBase] = useState<string>('/vacation_request/view');
  const [createNewVacationRequestButtonDisabled, setCreateNewVacationRequestButtonDisabled] = useState<boolean>(false);
  const [deleteDepartmentButtonDisabled, setDeleteDepartmentButtonDisabled] = useState<boolean>(false);
  const [readyToDisplayPage, setReadyToDisplayPage] = useState<boolean>(false);

  const datetimeFormat = Important.datetimeFormat;

  hasAccessAuth();


  function setVacationRequestRows(data: any) {
    setRows(
      data.map(
        (vacationRequest: { id: number; employee: any; startDate: Date; endDate: Date, status: string, days: number }) => {
          let name = '---';
          if(vacationRequest.employee)
            name = vacationRequest.employee.name+" "+vacationRequest.employee.surname;
          return {
            id: vacationRequest.id,

            employee: name,
            startDate: Datetime.getDate(vacationRequest.startDate, datetimeFormat),
            endDate: Datetime.getDate(vacationRequest.endDate, datetimeFormat),
            status: vacationRequest.status,
            days: vacationRequest.days,
          };
        }
      )
    );
  }

  async function getAllVacationRequests() {
    await httpClient.get(vacationRequesGetAll)
      .then((response) => {
        const data = response.data;
        setVacationRequestRows(data);
      })
      .catch((error) => {
        console.error(error);
      });
    setReadyToDisplayPage(true);
  }
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
              onClick={async () => {
                await httpClient
                  .delete(
                    `${vacationRequestUrl}/${cellValues?.row?.id}`
                  )
                  .then(async () => {
                    toast.info("Vacation request deleted successfully.");
                    await getAllVacationRequests();
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
    getAllVacationRequests();
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
        <DisplayTableTitle text= {'Leaves'} />
        <IconButton disabled={createNewVacationRequestButtonDisabled} color="primary" onClick={() => navigate(`/vacation_request/new`)}>
          <AddIcon />
        </IconButton>
      </div>
      <>
        <DisplayDataGrid rows = {rows ?? []} columns = {columns} />
      </>
      </>
      ) : (
        <>
        <DisplayLoader />
        </>
      )}
    </div>
  );
};

export default VacationRequestTable;