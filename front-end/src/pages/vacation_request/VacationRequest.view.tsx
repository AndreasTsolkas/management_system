	

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


const VacationRequestView = () => {
  const params: any | never = useParams();
  const navigate = useNavigate();
  const vacationRequestUrl = Important.backEndVacationRequestUrl;
  const vacationRequestId = params?.id;
  const [result, setResult] = useState<any>();
  const [displayData, setDisplayData] = useState<any[]>([]);


  function populateDisplayDataArray() {
    if (result) {
      const departmentInfoUrl = '/department/view/'+result.employee.department.id;
      setDisplayData([
      { key: 'id: ', value: result.id },
      { key: 'Όνομα εργαζομένου: ', value: result.employee.name },
      { key: 'Τμήμα εργαζομένου: ', value: <a href={departmentInfoUrl}>{result.employee.department.name}</a> },
      { key: 'Ημερομηνία έναρξης: ', value: moment(result.startDate).format('DD / MM / YYYY') },
      { key: 'Ημερομηνία λήξης: ', value: moment(result.endDate).format('DD / MM / YYYY') },
      { key: 'Αριθμός ημερών: ', value: result.days },
    ]);
    }
  }

  async function getCurrentUser() {
    try {
        const response: any = await axios.get(`${vacationRequestUrl}/${vacationRequestId}`);
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
      
      <h2>Πληροφορίες άδειας:</h2>
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
                <DisplayErrorMessage  message = "Πρόβλημα στην αναζήτηση του στοιχείων της άδειας."  />
            )}
        </div>
        
      </Box>
    </div>
  );
};

export default VacationRequestView;