	

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
import {hasAccessAuth, isAccessTokenNotExpired} from "src/useAuth";
import { httpClient } from "src/requests";


const DepartmentView = () => {
  const params: any | never = useParams();
  const navigate = useNavigate();
  const departmentId = params?.id;
  const [result, setResult] = useState<any>();
  const [displayData, setDisplayData] = useState<any[]>([]);

  const getAndCountOnUserBaseUrl = Important.getAndCountOnUserBaseUrl;

  hasAccessAuth();


  function populateDisplayDataArray() {
    if (result) {
        let displayData = [
            { key: 'id: ', value: result.departmentEntityData.id },
            { key: 'Name: ', value: result.departmentEntityData.name },
            { key: 'Employees`s number: ', value: result.employeesNum }
        ];

        if (result.employees.length > 0) {
            const employeeData = result.employees.map((item: any, index: any) => {
                const thisEmployeeInfoUrl = `${Important.employeeInfoUrl}${item.id}`;
                return <a key = {index} href={thisEmployeeInfoUrl}>{item.name} {item.surname},         </a>;
            });
            displayData.push({ key: 'Employees: ', value: employeeData });
        }

        setDisplayData(displayData);
    }
}

  async function getCurrentDepartment() {
    try {
        const response: any = await httpClient.get(`${getAndCountOnUserBaseUrl}/${departmentId}`);
        setResult(response.data);
    }
    catch(error: any) {
        console.error(error);
        toast.error(error.response.data.message);
    }
  }
    

  

  useEffect(() => {
    if (departmentId===undefined) {
      navigate(-1);
    }

  }, []);

  useEffect(() => {
    getCurrentDepartment();
  }, [departmentId]);

  useEffect(() => {
    populateDisplayDataArray();
  }, [result]);



  return (
    <div>
      
      {Display.displayIconButton()}
      
      <h2>Department details:</h2>
      <Box
        sx={{
          width: "600px",
        }}
      >
        <div style={{marginLeft:"25px"}}>
        {result ? (
            <div >
                  {displayData.map((item, index: any) => {
                    return Display.displayFieldWithTypography(item.key, item.value, index);
                  })}
            </div>
            ) : (
                <DisplayErrorMessage  message = "Error searching for department details."  />
            )}
        </div>
        
      </Box>
    </div>
  );
};

export default DepartmentView;