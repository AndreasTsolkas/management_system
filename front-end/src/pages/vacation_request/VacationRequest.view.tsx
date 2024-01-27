	

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
import * as Datetime from "src/datetime";
import {DisplayErrorMessage} from 'src/display';
import {hasAccessAuth} from "src/useAuth";
import { httpClient } from "src/requests";


const VacationRequestView = () => {
  const params: any | never = useParams();
  const navigate = useNavigate();
  const vacationRequestUrl = Important.vacationRequestUrl;
  const vacationRequestId = params?.id;
  const [result, setResult] = useState<any>();
  const [displayData, setDisplayData] = useState<any[]>([]);

  const datetimeFormat = Important.datetimeFormat;

  hasAccessAuth();


  function populateDisplayDataArray() {

    if (result) {
      
      let employeeField: any = '---';
      let departmentField: any = '---';
      
      if(result.employee) {
        const thisEmployeeInfoUrl = Important.employeeInfoUrl+result.employee.id;
        employeeField = <a href={thisEmployeeInfoUrl}>{result.employee.name} {result.employee.surname}</a>;
      }
        
      if(result?.employee?.department) {
        const thisDepartmentInfoUrl = Important.departmentInfoUrl+result.employee.department.id;
        departmentField = <a href={thisDepartmentInfoUrl}>{result.employee.department.name}</a>;
      }
        
      setDisplayData([
      { key: 'id: ', value: result.id },
      { key: 'Fullname: ', value: employeeField},
      { key: 'Employee`s department: ', value: departmentField },
      { key: 'Start date: ', value: Datetime.getDate(result.startDate,datetimeFormat) },
      { key: 'End date: ', value: Datetime.getDate(result.endDate,datetimeFormat) },
      { key: 'Days (working days): ', value: result.days },
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