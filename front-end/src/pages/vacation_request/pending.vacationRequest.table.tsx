import { GridColDef } from "@mui/x-data-grid";
import { Box, Button, Checkbox, CircularProgress, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IPost } from "./vacationRequest.model";
import { toast } from "react-toastify";
import * as Important from "src/important";
import * as Display from "src/display";
import * as Datetime from "src/datetime";
import {hasAccessAuth, isAdminAuth, isAccessTokenNotExpired} from "src/useAuth";
import { httpClient } from "src/requests";
import { DisplayDataGrid, DisplayLoader, DisplayTableTitle } from "src/display";

const PendingVacationRequestTable = () => {
  const [rows, setRows] = useState<IPost[]>([]);
  const navigate = useNavigate();
  const vacationRequestUrl = Important.vacationRequestUrl;
  const vacationRequestStatus = 'pending';
  const getVacationRequestByStatus = vacationRequestUrl+'/by/status?status='+vacationRequestStatus;
  const [arePendingRequestsExist, setArePendingRequestsExist] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCheckBoxChecked, setIsCheckboxChecked] = useState<boolean>(false);
  const [modalSelectedValue, setModalSelectedValue] = useState<boolean>(true);
  const [currentCheckedRecordId, setcurrentCheckedRecordId] = useState<number | null>(null);
  const [isRecordReadyToEvaluate, setIsRecordReadyToEvaluate] = useState<boolean>(false);
  const [readyToGetPendingVacationRequests, setReadyToGetPendingVacationRequests] = useState<boolean>(true);
  const [readyToDisplayPage, setReadyToDisplayPage] = useState<boolean>(false);

  const datetimeFormat = Important.datetimeFormat;

  hasAccessAuth();
  isAdminAuth();


  const body = (
    <Box sx={{ width: 300, bgcolor: 'background.paper', p: 2 }}>
      <Typography variant="h6" component="div" gutterBottom>
        Do you accept this leave request?
      </Typography>
      <div style={{marginTop:"20px"}}>
      <Button  variant="contained" color="primary" onClick={() => handleButtonClick(1)}>
        YES
      </Button>
      <Button style={{marginLeft:"10px"}} variant="contained" color="error" onClick={() => handleButtonClick(2)}>
        NO
      </Button>
      <Button style={{marginLeft:"10px"}} variant="contained" color="info" onClick={() => handleButtonClick(3)}>
        CANCEL
      </Button>
      </div>
    </Box>
  );

  function setPendingVacationRequestRows(data: any) {
    setRows(
      data.map(
        (vacationRequest: { id: any; employee: any; startDate: any; endDate: any, status: any, days: any }) => {
          return {
            id: vacationRequest.id,

            employee: vacationRequest.employee.name,
            startDate: Datetime.getDate(vacationRequest.startDate, datetimeFormat),
            endDate: Datetime.getDate(vacationRequest.endDate, datetimeFormat),
            days: vacationRequest.days,
          };
        }
      )
    );
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
        field: "days",
        headerName: "Days",
        flex: 1,
      },
    {
      field: "actions",
      headerName: "Evaluation ",
      flex: 1,
      renderCell:  (cellValues) => {
        let checkboxChecked=isCheckBoxChecked;
        return (
          <>
            <Checkbox 
             checked={checkboxChecked && currentCheckedRecordId === cellValues?.row.id}
             onClick={() => switchButtonOnClick(cellValues?.row.id)} /> 
        
          </>
        );
      },
    },
  ];

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleButtonClick = (value: any) => {
    if(value!==3) {
      let selectedValue = true;
      if(value==2) selectedValue = false;
      setModalSelectedValue(selectedValue);
      setIsRecordReadyToEvaluate(true);
      setReadyToGetPendingVacationRequests(true);
    }

    handleClose();
    setIsCheckboxChecked(false);

    
  };

  function switchButtonOnClick(recordId: number) {
    setIsModalOpen(true);
    setIsCheckboxChecked(true);
    setcurrentCheckedRecordId(recordId);
  }

  async function getPendingVacationRequests() {
    await httpClient
      .get(getVacationRequestByStatus)
      .then((response) => {
        if(response.data.areDataExist === true) {
          const data = response.data.result;
          setPendingVacationRequestRows(data);
          setArePendingRequestsExist(true);
        } 
        
        setReadyToGetPendingVacationRequests(false);
      })
      .catch((error) => {
        console.error(error);
      });
    setReadyToDisplayPage(true);
  }
  async function evaluatePendingVacarionRequest() {
    try {
      let requestUrl = vacationRequestUrl+'/evaluate/vrequest';
      const putData = {
        vacationRequestId: currentCheckedRecordId,
        approved: modalSelectedValue

      }
      const response: any = await httpClient.put(requestUrl, putData);
      toast.success("Vacation request evaluated successfully.");
      navigate('/vacation_request/view/'+response.data.id);
    }
    catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  }



  useEffect(() => {
    if (isRecordReadyToEvaluate) {
      evaluatePendingVacarionRequest();
    }
  }, [isRecordReadyToEvaluate]);

  useEffect(() => {
    if (readyToGetPendingVacationRequests) {
      getPendingVacationRequests();
    }
  }, [readyToGetPendingVacationRequests]);


  

  return (
    <div>
      {readyToDisplayPage ? (
        arePendingRequestsExist ? (
  <>
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              width: 300,
              textAlign: 'center',
            }}>
      {body}
      </Box>
    </Modal>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: 900,
      }}
    >
      <DisplayTableTitle text= {'Pending leaves'} />
    </div>
    <>
      <DisplayDataGrid rows = {rows ?? []} columns = {columns} />
    </>
  </>
) : (
  <h3>No avaliable pending requests.</h3>
)) : (
  <>
    <DisplayLoader />
  </>
)}
    </div>
  );
};

export default PendingVacationRequestTable;