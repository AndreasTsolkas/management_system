	

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import MuiTextField from "../../components/MuiTextField";
import { toast } from "react-toastify";
import { DepartmentSchema } from "../department/DepartmentForm";
import { IPost } from "./employee.model";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as Important from "src/important";
import * as Display from "src/display";
import * as Datetime from "src/datetime";
import {DisplayErrorMessage} from 'src/display';
import {hasAccessAuth, isAccessTokenNotExpired} from "src/useAuth";
import { httpClient } from "src/requests";


const EmployeeView = () => {
  const params: any | never = useParams();
  const navigate = useNavigate();
  const employeeUrl = Important.employeeUrl;
  const moreInformationLinkBase = Important.moreInformationLinkBase;
  const userId = params?.id;
  const [result, setResult] = useState<any>();
  const [displayData, setDisplayData] = useState<any[]>([]);

  const employeeViewBaseUrl = employeeUrl+'/'+moreInformationLinkBase;
  const datetimeFormat = Important.datetimeFormat;

  hasAccessAuth();


  function populateDisplayDataArray() {
    
    if (result) {
      
      let isAdminText = 'Yes';
      if(!result.isAdmin) isAdminText = 'No';
      let resultDepartmentValue: any = '-----';
      if (result.department !== null ) {
        const departmentInfoUrl = employeeViewBaseUrl+result.department.id;
        resultDepartmentValue = <a href={departmentInfoUrl}>{result.department.name}</a>;
      }
      setDisplayData([
      { key: 'Name: ', value: result.name },
      { key: 'Surname: ', value: result.surname },
      { key: 'Email: ', value: result.email },
      { key: 'Employee UId: ', value: result.employeeUid },
      { key: 'Employment type: ', value: result.employmentType },
      { key: 'Department: ', value: resultDepartmentValue },
      { key: 'Salary: ', value: result.salary },
      { key: 'Start datetime: ', value: Datetime.getDate(result.startDate, datetimeFormat)},
      { key: 'Vacation days (limit): ', value: result.vacationDays },
      { key: 'Is admin: ', value: isAdminText }
    ]);
    }
  }

  async function getCurrentEmployee() {
    try {
        const response: any = await httpClient.get(`${employeeUrl}/${userId}`);
        setResult(response.data);
    }
    catch(error: any) {
        console.error(error);
        toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    if (userId===undefined) {
      navigate(-1);
    }

  }, []);

  useEffect(() => {
    getCurrentEmployee();
  }, [userId]);

  useEffect(() => {
    populateDisplayDataArray();
  }, [result]);



  return (
    <div>
      
      {Display.displayIconButton()}
      
      <h2>Employee details:</h2>
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
                <DisplayErrorMessage  message = "Error searching for employee details."  />
            )}
        </div>
        
      </Box>
    </div>
  );
};

export default EmployeeView;