	

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


const DepartmentView = () => {
  const params: any | never = useParams();
  const navigate = useNavigate();
  const departmentUrl = Important.backEndDepartmentUrl;
  const departmentId = params?.id;
  const [result, setResult] = useState<any>();
  const [displayData, setDisplayData] = useState<any[]>([]);

  const getAndCountOnUserBaseUrl = departmentUrl+'/countonuser';


  function populateDisplayDataArray() {
    if (result) {
        
        setDisplayData([
            { key: 'id: ', value: result.departmentEntityData.id },
            { key: 'Όνομα: ', value: result.departmentEntityData.name },
            { key: 'Αριθμός εργαζομένων: ', value: result.employeesNum },
            { key: 'Εργαζόμενοι: ', value: result.employees.map((item: any) => {
                  const thisEmployeeInfoUrl = Important.employeeInfoUrl+item.id;
                  return <a href={thisEmployeeInfoUrl}>{item.name} {item.surname}, </a>;
              })
            },
        ]);
    }
}

  async function getCurrentDepartment() {
    try {
        const response: any = await axios.get(`${getAndCountOnUserBaseUrl}/${departmentId}`);
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
      
      <h2>Πληροφορίες τμήματος:</h2>
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
                <DisplayErrorMessage  message = "Πρόβλημα στην αναζήτηση του στοιχείων του τμήματος."  />
            )}
        </div>
        
      </Box>
    </div>
  );
};

export default DepartmentView;