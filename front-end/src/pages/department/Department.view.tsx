	
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { toast } from "react-toastify";
import * as Important from "src/important";
import * as Display from "src/display";
import {DisplayErrorMessage, DisplayFieldWithTypography, DisplayViewTitle} from 'src/display';
import {hasAccessAuth} from "src/useAuth";
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
            { key: 'Name: ', value: result.departmentEntityData.name },
            { key: 'Employees`s (number): ', value: result.employeesNum }
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
    <div className="standart-page">
      
      {Display.DisplayIconButton()}
      <DisplayViewTitle text='Department details: ' />
      <Box
        sx={{
          width: "600px",
        }}
      >
        <div style={{marginLeft:Important.viewDataMarginLeft}}>
        {result ? (
            <div >
              {displayData.map((item, index) => (
                <DisplayFieldWithTypography key ={index} name = {item.key} data = {item.value} index = {index} />
              ))}
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