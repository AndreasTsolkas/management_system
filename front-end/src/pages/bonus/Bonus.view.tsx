	

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import MuiTextField from "../../components/MuiTextField";
import { toast } from "react-toastify";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as Important from "src/important";
import * as Display from "src/display";
import * as Datetime from "src/datetime";
import {DisplayErrorMessage, DisplayFieldWithTypography, DisplayIconButton, DisplayViewTitle} from 'src/display';
import {hasAccessAuth, isAdminAuth} from "src/useAuth";
import { httpClient } from 'src/requests';


const BonusView = () => {
  const params: any | never = useParams();
  const navigate = useNavigate();
  const bonusUrl = Important.bonusUrl;
  const bonusId = params?.id;
  const [result, setResult] = useState<any>();
  const [displayData, setDisplayData] = useState<any[]>([]);

  const datetimeFormat = Important.datetimeFormat;

  hasAccessAuth();


  function populateDisplayDataArray() {

    if (result) {
      let employeeField: any = '---';

      if(result.employee) {
        const thisEmployeeInfoUrl = Important.employeeInfoUrl+result.employee.id;
        employeeField = <a href={thisEmployeeInfoUrl}>{result.employee.name} {result.employee.surname}</a>;
      }

      setDisplayData([
      { key: 'Fullname: ', value: employeeField},
      { key: 'Amount: ', value: result.amount },
      { key: 'Datetime: ', value: Datetime.getDate(result.date_given, datetimeFormat) },
    ]);
    }
  }

  async function getCurrentBonus() {
    try {
        const response: any = await httpClient.get(`${bonusUrl}/${bonusId}`);
        setResult(response.data);
    }
    catch(error: any) {
        console.error(error);
        toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    if (bonusId===undefined) {
      navigate(-1);
    }

  }, []);

  useEffect(() => {
    getCurrentBonus();
  }, [bonusId]);

  useEffect(() => {
    populateDisplayDataArray();
  }, [result]);



  return (
    <div>
      
      {Display.DisplayIconButton()}
      <DisplayViewTitle text='Bonus details: ' />
      
      <Box
        sx={{
          width: "600px",
        }}
      >
        <div style={{marginLeft:Important.viewDataMarginLeft}}>
        {result ? (
            <div>
             {displayData.map((item, index) => (
                <DisplayFieldWithTypography key ={index} name = {item.key} data = {item.value} index = {index} />
              ))}
            </div>
            ) : (
                <DisplayErrorMessage  message = "Error searching for bonus details."  />
            )}
        </div>
        
      </Box>
    </div>
  );
};

export default BonusView;