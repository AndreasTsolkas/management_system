	

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import MuiTextField from "../../components/MuiTextField";
import axios from "axios";
import { toast } from "react-toastify";
import { DepartmentSchema } from "../department/DepartmentForm";
import { IPost } from "./employee.model";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as Important from "src/important";
import * as Display from "src/display";
import {DisplayErrorMessage} from 'src/display';
import moment from "moment";


const EmployeeView = () => {
  const isAdmin = false;
  const params: any | never = useParams();
  const navigate = useNavigate();
  const employeeUrl = Important.backEndEmployeeUrl;
  const userId = params?.id;
  const [result, setResult] = useState<any>();
  const [displayData, setDisplayData] = useState<any[]>([]);


  function populateDisplayDataArray() {
    
    if (result) {
      
      let isAdminText = 'Ναι';
      if(!result.isAdmin) isAdminText = 'Όχι';
      let resultDepartmentValue: any = '-----';
      if (result.department !== null ) {
        const departmentInfoUrl = '/department/view/'+result.department.id;
        resultDepartmentValue = <a href={departmentInfoUrl}>{result.department.name}</a>;
      }
      setDisplayData([
      { key: 'id: ', value: result.id },
      { key: 'Όνομα: ', value: result.name },
      { key: 'Επώνυμο: ', value: result.surname },
      { key: 'Email: ', value: result.email },
      { key: 'Αριθμός μητρώου: ', value: result.employeeUid },
      { key: 'Επάγγελμα: ', value: result.employmentType },
      { key: 'Τμήμα: ', value: resultDepartmentValue },
      { key: 'Μισθός: ', value: result.salary },
      { key: 'Ημέρα πρόσληψης: ', value: moment(result.startDate).format('DD / MM / YYYY') },
      { key: 'Ημέρες διακοπών (όριο): ', value: result.vacationDays },
      { key: 'Συμμετέχει στη διαχείριση: ', value: isAdminText }
    ]);
    }
  }

  async function getCurrentUser() {
    try {
        const response: any = await axios.get(`${employeeUrl}/${userId}`);
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
    getCurrentUser();
  }, [userId]);

  useEffect(() => {
    populateDisplayDataArray();
  }, [result]);



  return (
    <div>
      
      {Display.displayIconButton()}
      
      <h2>Πληροφορίες εργαζόμενου:</h2>
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
                <DisplayErrorMessage  message = "Πρόβλημα στην αναζήτηση του στοιχείων του εργαζόμενου."  />
            )}
        </div>
        
      </Box>
    </div>
  );
};

export default EmployeeView;