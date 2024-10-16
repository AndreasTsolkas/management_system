
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  MenuItem,
  Select,
} from "@mui/material";
import * as yup from "yup";
import { toast } from "react-toastify";
import * as Important from "src/important";
import * as Display from "src/display";
import { Season } from "src/enums/season";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import {hasAccessAuth, isAdminAuth} from "src/useAuth";
import {httpClient} from "src/requests";
import { DisplayFieldWithTypography, DisplayViewTitle } from "src/display";



const schema = yup.object({
  employeeId: yup
    .number()
    .typeError("Select an employee is required.")
    .required("Select an employee is required."),
  season: yup
    .string()
    .typeError("Select th season in which the employee will recieve the bonus is required.")
    .required("Select th season in which the employee will recieve the bonus is required."),
});

const CreateBonusForm = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeeSelected, setEmployeeSelected] = useState<boolean>(false);
  const [seasonSelected, setSeasonSelected] = useState<boolean>(false);
  const [readyToGetBonusCalculation, setReadyToGetBonusCalculation] = useState<boolean>(false);
  const [currentEmployeeCurrentSalary, setCurrentEmployeeCurrentSalary] = useState<number | null>(null);
  const [currentEmployeeBonusRate, setCurrentEmployeeBonusRate] = useState<number | null>(null);
  const [currentEmployeeNewSalary, setCurrentEmployeeNewSalary] = useState<number | null>(null);
  const [currentSeason, setCurrentSeason] = useState<string | null>(null);
  const [readyToDisplayPage, setReadyToDisplayPage] = useState<boolean>(false);

  const bonusUrl = Important.bonusUrl;
  const employeeGetAll = Important.getAllEmployee;

  hasAccessAuth();
  isAdminAuth();

  const {
    
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employeeId: "",
      season: "",
    },
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();


  const onReset = (data: any) => {
    reset(data);
    setEmployeeSelected(false);
    setSeasonSelected(false);
    setCurrentEmployeeCurrentSalary(null);
    setCurrentEmployeeBonusRate(null);
    setCurrentEmployeeNewSalary(null);
    setCurrentSeason(null);
    setReadyToDisplayPage(false);
  }

  const onSubmit = async (data: any) => {
    const requestUrl = bonusUrl + `/create/bonus`;
    const putData = {
      employeeId: data.employeeId,
      season: data.season,
    };
      await httpClient
        .put(requestUrl, putData)
        .then((response) => {
          toast.success("Bonus created successfully.");
          navigate('/bonus/view/'+response.data.id);
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
  };

  const onChange = async (data: any, isEmployeeSelected: boolean) => {
    if(isEmployeeSelected) {
      setEmployeeSelected(true);
      setCurrentEmployeeCurrentSalary(employees.find(employees => employees.id === data.target.value)?.salary)
    }
    else {
      setSeasonSelected(true);
      setCurrentSeason(data.target.value);
    }
    setReadyToGetBonusCalculation(true);
  };

  const getAllEmployees =  async () => {
    const requestUrl = employeeGetAll;
    try {
      const response = await httpClient.get(requestUrl);
      setEmployees(response.data);

    }
    catch(error: any) {
      console.error(error);
      toast.error(error?.response.data.message);
    }
    finally {
      setReadyToDisplayPage(true);
    }
  }

  const setBonusCalculationInformation = async () => {
    const requestUrl = bonusUrl+'/calculate/'+currentEmployeeCurrentSalary+'/'+currentSeason;
    try {
      const response = await httpClient.get(requestUrl);
      setCurrentEmployeeBonusRate(response.data.bonusRate);
      setCurrentEmployeeNewSalary(response.data.newSalary);
      setReadyToGetBonusCalculation(false);

    }
    catch(error: any) {
      console.error(error);
      toast.error(error?.response.data.message);
    }
  }

  useEffect(() => {
    getAllEmployees();
  }, [employees]);

  useEffect(() => {
    if(readyToGetBonusCalculation && employeeSelected===true && seasonSelected===true) {
      setBonusCalculationInformation();
    }
       
  }, [readyToGetBonusCalculation, employeeSelected, seasonSelected]);



  return (
    <div>
      {readyToDisplayPage ? (
        <>
      <div className="exceptional-page">
      <DisplayViewTitle text='Create new bonus: ' />
      
      <div >
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <Box sx={{ width: "200px" }}>
        <form  noValidate onReset = {onReset} onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="employeeId"
            control={control}
            render={({ field }) => (
              <div>
   
                <Select
                  {...field}

                  fullWidth
                  variant="outlined"
                  onChange={(e) => {
                    field.onChange(e);
                    onChange(e, true);
                  }}
                >
                  {employees.map((item: any) => {
                    let departmentNameValue: string = '-----';
                    if(item.department !==null) departmentNameValue = item.department.name;
                    return (
                    <MenuItem key={item.id} value={item.id}>
                       {item.name} {item.surname}, {departmentNameValue}, {item.salary}$ μισθός, 
                    </MenuItem>
                    );
                  })} 
                </Select>
                <span style={{ color: "red" }}>{errors.employeeId?.message}</span>
              </div>
            )}
          />
          <Controller
            name="season"
            control={control}
            render={({ field }) => (
              <div style={{marginTop:"10px"}}>
  
                <Select
                  {...field}

                  fullWidth
                  variant="outlined"
                  onChange={(e) => {
                    field.onChange(e);
                    onChange(e, false);
                  }}
                  
                >
                  {Object.entries(Season).map(([name, value]) => (
                    
                    <MenuItem key={name} value={name}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
                <span style={{ color: "red" }}>{errors.season?.message}</span>
              </div>
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
          <Button
            type="reset"
            fullWidth
            variant="outlined"
          >
            Reset
          </Button>
        </form>
      </Box>
      <Box sx={{ marginLeft:"200px", width: "50%" }}>
      {(employeeSelected && seasonSelected) && (
          <div style={{ marginTop: "25px" }}>
            <DisplayFieldWithTypography name={'Current salary: '} data = {currentEmployeeCurrentSalary} index={1} />
            <DisplayFieldWithTypography name={'Increase factor: '} data = {currentEmployeeBonusRate} index={2} />
            <DisplayFieldWithTypography name={'Salary after increase: '} data = {currentEmployeeNewSalary} index={3} />
          </div>
      )}
       
      </Box>
      </Box>
      </div>
      </div>
      <div id="result"></div>
      </>
      ) : (
        <>
        {Display.DisplayLoader()}
        </>
      )}
    </div>
  );
};

export default CreateBonusForm;