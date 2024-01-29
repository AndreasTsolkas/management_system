	

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { toast } from "react-toastify";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as Important from "src/important";
import * as Display from "src/display";
import * as Datetime from "src/datetime";
import {DisplayErrorMessage} from 'src/display';
import {hasAccessAuth, isAccessTokenNotExpired} from "src/useAuth";
import { httpClient } from "src/requests";


const MyProfile = () => {
  const params: any | never = useParams();
  const navigate = useNavigate();
  const profileUrl = Important.profileUrl;
  const userId = 2;
  const [result, setResult] = useState<any>();
  const [displayData, setDisplayData] = useState<any[]>([]);

  const datetimeFormat = Important.datetimeFormat;

  hasAccessAuth();


  function populateDisplayDataArray() {
    
    if (result) {
      
      let isAdminText = 'Yes';
      if(!result.isAdmin) isAdminText = 'No';
      let resultDepartmentValue: any = '-----';
      if (result.department !== null ) {
        const departmentInfoUrl = '/department/view/'+result.department.id;
        resultDepartmentValue = <a href={departmentInfoUrl}>{result.department.name}</a>;
      }
      setDisplayData([
      { key: 'id: ', value: result.id },
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

  async function getProfile() {
    try {
        const response: any = await httpClient.get(`${profileUrl}`);
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
    getProfile();
  }, [userId]);

  useEffect(() => {
    populateDisplayDataArray();
  }, [result]);



  return (
    <div>
      
      {Display.displayIconButton()}
      
      <h2>My profile:</h2>
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
      <Box sx={{ width: "50%" }}
      >
        <div style={{marginLeft:"25px"}}>
        {result ? (
            <div>
                  {displayData.map((item, index) => {
                    return Display.displayFieldWithTypography(item.key, item.value, index);
                  })}
            </div>
            ) : (
                <DisplayErrorMessage  message = "Error searching for profile."  />
            )}
        </div>
        
        
        
      </Box>
      <Box sx={{ width: "50%" }}
      >
        <div style={{marginLeft:"25px"}}>
        {result ? (
            <div>
                  {displayData.map((item, index) => {
                    return Display.displayFieldWithTypography(item.key, item.value, index);
                  })}
            </div>
            ) : (
                <DisplayErrorMessage  message = "Error searching for profile."  />
            )}
        </div>
        
      </Box>
      </Box>
      <Link style={{ marginLeft:"350px", marginTop:"55px", fontSize: '25px' }} to="/editprofile/2" >Edit profile</Link>
    </div>
  );
};

export default MyProfile;