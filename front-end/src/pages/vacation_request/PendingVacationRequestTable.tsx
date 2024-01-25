import { GridColDef } from "@mui/x-data-grid";
import { Box, Button, Checkbox, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IPost } from "./vacationRequest.model";
import { toast } from "react-toastify";
import axios from "axios";
import * as Important from "src/important";
import * as Display from "src/display";
import moment from "moment";
import {hasAccessAuth, isAdminAuth} from "src/useAuth";
import { httpClient } from "src/requests";

const PendingVacationRequestTable = () => {
  const [rows, setRows] = useState<IPost[]>([]);
  const navigate = useNavigate();
  const vacationRequestUrl = Important.vacationRequestUrl;
  const vacationRequestGetAll = Important.getAllVacationRequest;
  const vacationRequestStatus = 'pending';
  const getVacationRequestByStatus = vacationRequestUrl+'/by/status?status='+vacationRequestStatus;
  const [arePendingRequestsExist, setArePendingRequestsExist] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCheckBoxChecked, setIsCheckboxChecked] = useState<boolean>(false);
  const [modalSelectedValue, setModalSelectedValue] = useState<boolean>(true);
  const [currentCheckedRecordId, setcurrentCheckedRecordId] = useState<number | null>(null);
  const [isRecordReadyToEvaluate, setIsRecordReadyToEvaluate] = useState<boolean>(false);
  const [readyToGetPendingVacationRequests, setReadyToGetPendingVacationRequests] = useState<boolean>(true);

  hasAccessAuth();
  isAdminAuth();


  const body = (
    <Box sx={{ width: 300, bgcolor: 'background.paper', p: 2 }}>
      <Typography variant="h6" component="div" gutterBottom>
        Do you accept this vacation request;
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
    await axios
      .get(getVacationRequestByStatus)
      .then((response) => {
        if(response.data.areDataExist === true) {
          const data = response.data;
          setRows(
            data.map(
              (vacationRequest: { id: any; employee: any; startDate: any; endDate: any, status: any, days: any }) => {
                return {
                  id: vacationRequest.id,

                  employee: vacationRequest.employee.name,
                  startDate: moment(vacationRequest.startDate).format('MM / DD / YYYY'),
                  endDate: moment(vacationRequest.endDate).format('MM / DD / YYYY'),
                  days: vacationRequest.days,
                };
              }
            )
          );
          setArePendingRequestsExist(true);
        } 
        
        setReadyToGetPendingVacationRequests(false);
      })
      .catch((error) => {
        console.error(error);
      });
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
      {arePendingRequestsExist ? (
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
      <h2>Pending leave requests</h2>
    </div>
    <Box sx={{ height: 500, width: 900 }}>
      {Display.displayDataGrid(rows ?? [], columns)} 
    </Box>
  </>
) : (
  <h3>No avaliable pending requests.</h3>
)}
    </div>
  );
};

export default PendingVacationRequestTable;