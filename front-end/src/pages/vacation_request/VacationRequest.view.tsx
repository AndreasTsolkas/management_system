	

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import MuiTextField from "../../components/MuiTextField";
import axios from "axios";
import { toast } from "react-toastify";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as Important from "src/important";
import * as Display from "src/display";
import {DisplayErrorMessage} from 'src/display';
import moment from "moment";
import {hasAccessAuth, isAdminAuth} from "src/useAuth";
import { httpClient } from "src/requests";


const VacationRequestView = () => {
  const params: any | never = useParams();
  const navigate = useNavigate();
  const vacationRequestUrl = Important.vacationRequestUrl;
  const vacationRequestId = params?.id;
  const [result, setResult] = useState<any>();
  const [displayData, setDisplayData] = useState<any[]>([]);

  hasAccessAuth();


  function populateDisplayDataArray() {

    if (result) {
      const thisEmployeeInfoUrl = Important.employeeInfoUrl+result.employee.id;
      const thisDepartmentInfoUrl = Important.departmentInfoUrl+result.employee.department.id;
      setDisplayData([
      { key: 'id: ', value: result.id },
      { key: 'Fullname: ', value: <a href={thisEmployeeInfoUrl}>{result.employee.name} {result.employee.surname}</a>},
      { key: 'Employee`s department: ', value: <a href={thisDepartmentInfoUrl}>{result.employee.department.name}</a> },
      { key: 'Start date: ', value: moment(result.startDate).format('DD / MM / YYYY') },
      { key: 'End date: ', value: moment(result.endDate).format('DD / MM / YYYY') },
      { key: 'Days: ', value: result.days },
    ]);
    }
  }

  async function getCurrentUser() {
    try {
        const response: any = await httpClient.get(`${vacationRequestUrl}/${vacationRequestId}`);
        setResult(response.data);
    }
    catch(error: any) {
        console.error(error);
        toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    if (vacationRequestId===undefined) {
      navigate(-1);
    }

  }, []);

  useEffect(() => {
    getCurrentUser();
  }, [vacationRequestId]);

  useEffect(() => {
    populateDisplayDataArray();
  }, [result]);



  return (
    <div>
      
      {Display.displayIconButton()}
      
      <h2>Leave details:</h2>
      <Box
        sx={{
          width: "600px",
        }}
      >
        <div style={{marginLeft:"25px"}}>
        {result ? (
            <div>
                  {displayData.map((item, index) => {
                    return Display.displayFieldWithTypography(item.key, item.value, index);
                  })}
            </div>
            ) : (
                <DisplayErrorMessage  message = "Error searching for vacation request details."  />
            )}
        </div>
        
      </Box>
    </div>
  );
};

export default VacationRequestView;