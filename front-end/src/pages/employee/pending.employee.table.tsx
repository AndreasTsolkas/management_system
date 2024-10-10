import { GridColDef } from "@mui/x-data-grid";
import { Box, Button, Checkbox, Modal, Typography, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IPost } from "./employee.model";
import { toast } from "react-toastify";
import * as Important from "src/important";
import * as Display from "src/display";
import * as Datetime from "src/datetime";
import {hasAccessAuth, isAdminAuth} from "src/useAuth";
import { httpClient } from "src/requests";
import { DisplayDataGrid, DisplayLoader, DisplayTableTitle } from "src/display";

const PendingEmployeeTable = () => {
  const [rows, setRows] = useState<IPost[]>([]);
  const navigate = useNavigate();
  const employeeUrl = Important.employeeUrl;
  const vacationRequestStatus = 'pending';
  const getNotAcceptedEmployees = employeeUrl+'/only/byisaccepted';
  const [arePendingRequestsExist, setArePendingRequestsExist] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCheckBoxChecked, setIsCheckboxChecked] = useState<boolean>(false);
  const [modalSelectedValue, setModalSelectedValue] = useState<boolean>(true);
  const [currentCheckedRecordId, setcurrentCheckedRecordId] = useState<number | null>(null);
  const [isRecordReadyToEvaluate, setIsRecordReadyToEvaluate] = useState<boolean>(false);
  const [readyToGetPendingRequests, setReadyToGetPendingRequests] = useState<boolean>(true);
  const [readyToDisplayPage, setReadyToDisplayPage] = useState<boolean>(false);

  const datetimeFormat = Important.datetimeFormat;
  const employeeEvaluateRegistrationRequestUrl = employeeUrl +'/evaluate/regitsrtionrequest';

  hasAccessAuth();
  isAdminAuth();


  const body = (
    <Box sx={{ width: 300, bgcolor: 'background.paper', p: 2 }}>
      <Typography variant="h6" component="div" gutterBottom>
        Do you accept this regitsration request? If not the employee will be deleted permanently.
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
        (employee: { id: string; name: string; surname: string; employeeUid: number, startDate: Date }) => {
          return {
            id: employee.id,
            name: employee.name,
            surname: employee.surname,
            employeeUId: employee.employeeUid,
            startDate: Datetime.getDate(employee.startDate, datetimeFormat),
          };
        }
      )
    );
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "id", flex: 1 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "surname",
      headerName: "Surname",
      flex: 1,
    },
    {
      field: "employeeUId",
      headerName: "Employee UId",
      flex: 1,
    },
      {
        field: "startDate",
        headerName: "Start date",
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
      setReadyToGetPendingRequests(true);
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
    const getParams = {
      isAccepted: false
    }
    await httpClient
      .get(getNotAcceptedEmployees, getParams)
      .then((response) => {
        if(response.data.areDataExist === true) {
          const data = response.data.result;
          setPendingVacationRequestRows(data);
          setArePendingRequestsExist(true);
        } 
        
        setReadyToGetPendingRequests(false);
      })
      .catch((error) => {
        console.error(error);
      });
    setReadyToDisplayPage(true);
  }
  async function evaluatePendingRegistrationRequest() {
    try {
      let requestUrl = employeeEvaluateRegistrationRequestUrl;
      const putData = {
        employeeId: currentCheckedRecordId,
        approved: modalSelectedValue

      }
      const response: any = await httpClient.put(requestUrl, putData);
      toast.success("Registration request evaluated successfully.");
      if(modalSelectedValue) navigate('/employee/view/'+response.data.id); // modalSelectedValue is 'true' for become accepted and 'false' for the opposite
    }
    catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  }



  useEffect(() => {
    if (isRecordReadyToEvaluate) {
      evaluatePendingRegistrationRequest();
    }
  }, [isRecordReadyToEvaluate]);

  useEffect(() => {
    if (readyToGetPendingRequests) {
      getPendingVacationRequests();
    }
  }, [readyToGetPendingRequests]);


  

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
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  p: 4,
                  width: 330,
                  textAlign: 'center',
                }}
              >
                {body}
              </Box>
            </Modal>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: 900,
              }}
            >
            <DisplayTableTitle text= {'Pending employees'} />
            </div>
            <>
              <DisplayDataGrid rows = {rows ?? []} columns = {columns} />
            </>
          </>
        ) : (
          <h3>No available pending requests.</h3>
        )
      ) : (
        <>
          <DisplayLoader />
        </>
      )}
    </div>
  );
};

export default PendingEmployeeTable;