	

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
  const departmentUrl = Important.departmentUrl;
  const bonusUrl = Important.bonusUrl;
  const vacationRequestUrl = Important.vacationRequestUrl;
  const moreInformationLinkBase = Important.moreInformationLinkBase;
  const userId = 2;
  const [result, setResult] = useState<any>();
  const [displayBasicData, setDisplayBasicData] = useState<any[]>([]);
  const [displaySpecialData, setDisplaySpecialData] = useState<any[]>([]);

  const departmentViewBaseUrl = departmentUrl+'/'+moreInformationLinkBase;
  const bonusViewBaseUrl = bonusUrl+'/'+moreInformationLinkBase;
  const vacationRequestViewBaseUrl = vacationRequestUrl+'/'+moreInformationLinkBase;
  const datetimeFormat = Important.datetimeFormat;

  hasAccessAuth();


  function populateDisplayBasicDataArray() {
    
    if (result) {
      let basicData = result.basicData;
      let isAdminText = 'Yes';
      if(!basicData.isAdmin) isAdminText = 'No';
      let resultDepartmentValue: any = '-----';
      if (basicData.department !== null ) {
        const departmentInfoUrl = departmentViewBaseUrl+basicData.department.id;
        resultDepartmentValue = <a href={departmentInfoUrl}>{basicData.department.name}</a>;
      }
      setDisplayBasicData([
      { key: 'id: ', value: basicData.id },
      { key: 'Name: ', value: basicData.name },
      { key: 'Surname: ', value: basicData.surname },
      { key: 'Email: ', value: basicData.email },
      { key: 'Employee UId: ', value: basicData.employeeUid },
      { key: 'Employment type: ', value: basicData.employmentType },
      { key: 'Department: ', value: resultDepartmentValue },
      { key: 'Salary: ', value: basicData.salary },
      { key: 'Start datetime: ', value: Datetime.getDate(basicData.startDate, datetimeFormat)},
      { key: 'Vacation days (limit): ', value: basicData.vacationDays },
      { key: 'I am admin: ', value: isAdminText }
    ]);
    }
  }

  function populateDisplaySpecialDataArray() {
    
    if (result) {
      let specialData = result.specialData;
      let isOnLeave = 'Yes';
      let hasPendingVacationRequests = 'Yes';
      if(!specialData.isOnLeave) isOnLeave = 'No';
      if(!specialData.hasPendingVacationRequests) hasPendingVacationRequests = 'No';
      let resultLastBonusGivenValue: any = '-----';
      let resultLastLeaveTakenValue: any = '-----';

      if (specialData.lastBonusGiven !== null ) {
        const lastBonusGivenInfoUrl = bonusViewBaseUrl+specialData.lastBonusGiven.id;
        resultLastBonusGivenValue = <a href={lastBonusGivenInfoUrl}>view</a>;
      }

      if (specialData.lastLeaveTaken !== null ) {
        const lastLeaveTakenInfoUrl = vacationRequestViewBaseUrl+specialData.lastLeaveTaken.id;
        resultLastLeaveTakenValue = <a href={lastLeaveTakenInfoUrl}>view</a>;
      }
      setDisplaySpecialData([
      { key: 'Total bonuses (number): ', value: specialData.bonusTotalNum },
      { key: 'Total leaves (number): ', value: specialData.leavesTotalNum  },
      { key: 'Last bonus: ', value: resultLastBonusGivenValue  },
      { key: 'Last leave: ', value: resultLastLeaveTakenValue  },
      { key: 'Am I on leave: ', value: isOnLeave  },
      { key: 'Do I have any pending leave request: ', value: hasPendingVacationRequests  },

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
    getProfile();
  }, [userId]);

  useEffect(() => {
    populateDisplayBasicDataArray();
    populateDisplaySpecialDataArray();
  }, [result]);



  return (
    <div>
      
      <h2 style={{ marginLeft: '360px', marginBottom:"50px" }}>My profile:</h2>
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
      <Box sx={{ width: '550px' }}
      >
        <div style={{marginLeft:"25px"}}>
        {result ? (
            <div>
                  {displayBasicData.map((item, index) => {
                    return Display.displayFieldWithTypography(item.key, item.value, index);
                  })}
            </div>
            ) : (
                <DisplayErrorMessage  message = "Error searching for profile."  />
            )}
        </div>
        
        
        
      </Box>
      <Box sx={{ width: "500px" }}
      >
        <div style={{marginLeft:"25px", marginTop:"9px"}}>
        {result ? (
            <div>
                  {displaySpecialData.map((item, index) => {
                    return Display.displayFieldWithTypography(item.key, item.value, index);
                  })}
            </div>
            ) : (
                <DisplayErrorMessage  message = "Error searching for profile."  />
            )}
        </div>
        
      </Box>
      </Box>
      <div style={{marginTop:"35px", marginLeft:"370px"}}>
      <Link style={{ fontSize: '25px' }} to="/editprofile/2" >Edit profile</Link>
      </div>
    </div>
  );
};

export default MyProfile;