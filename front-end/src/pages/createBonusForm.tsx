import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import * as Important from "src/important";
import * as Display from "src/display";
import { Season } from "src/enums/season";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import {hasAccessAuth, isAdminAuth} from "src/useAuth";



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

  const bonusUrl = Important.backEndBonusUrl;
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
  }

  const onSubmit = (data: any) => {
    const requestUrl = bonusUrl + `/create/bonus`;
    const putData = {
      employeeId: data.employeeId,
      season: data.season,
    };
      axios
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
      const response = await axios.get(requestUrl);
      setEmployees(response.data);

    }
    catch(error: any) {
      console.error(error);
      toast.error(error?.response.data.message);
    }
  }

  const setBonusCalculationInformation = async () => {
    const requestUrl = bonusUrl+'/calculate/'+currentEmployeeCurrentSalary+'/'+currentSeason;
    try {
      const response = await axios.get(requestUrl);
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
  }, []);

  useEffect(() => {
    if(readyToGetBonusCalculation && employeeSelected===true && seasonSelected===true) {
      setBonusCalculationInformation();
    }
       
  }, [readyToGetBonusCalculation, employeeSelected, seasonSelected]);



  return (
    <div>
      <h2 >Create new bonus: </h2>
      <div >
      <Box sx={{ width: "200px" }}>
        <form  noValidate onReset = {onReset} onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="employeeId"
            control={control}
            render={({ field }) => (
              <div>
                <InputLabel htmlFor="employee-label">Employee</InputLabel>
                <Select
                  {...field}
                  labelId="employee-label"
                  id="employee-label"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => {
                    field.onChange(e);
                    onChange(e, true);
                  }}
                >
                  {employees.map((item: any) => {
                    let departmentNameValue: any = '-----';
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
                <InputLabel htmlFor="season-label">Season</InputLabel>
                <Select
                  {...field}
                  labelId="season-label"
                  id="season-label"
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
      <Box sx={{ marginLeft: "250px", width: "600px" }}>
      {(employeeSelected && seasonSelected) && (
          <div style={{ marginTop: "70px" }}>
            {Display.displayFieldWithTypography('Current salary: ', currentEmployeeCurrentSalary, 1)}
            {Display.displayFieldWithTypography('Increase factor: ', currentEmployeeBonusRate, 2)}
            {Display.displayFieldWithTypography('Salary after increase: ', currentEmployeeNewSalary, 3)}
          </div>
      )}
       
      </Box>
      </div>
      <div id="result"></div>
    </div>
  );
};

export default CreateBonusForm;