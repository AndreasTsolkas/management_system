	

import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Box, Button, CircularProgress, InputLabel, MenuItem, Select } from "@mui/material";
import MuiTextField from "../../components/MuiTextField";
import axios from "axios";
import { toast } from "react-toastify";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { IPost } from "./vacationRequest.model";
import * as Important from "src/important";
import * as Display from "src/display";
import moment from "moment";


const VacationRequestForm = () => {

  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const vacationRequestUrl = Important.backEndVacationRequestUrl;
  const employeeUrl = Important.backEndEmployeeUrl;
  const [avaliableDays, setAvaliableDays] = useState<number | null>(null);
  const [validatedStartDate, setValidatedStartDate] = useState<any | null>(null);
  const [validatedEndDate, setValidatedEndDate] = useState<any | null>(null);
  const [isNewDateSelected, setIsNewDateSelected] = useState<boolean>(false);
  const [isDifferenceOutOfRage, setIsDifferenceOutOfRage] = useState<boolean>(false);
  const [differenceOutOfRageMessage, setDifferenceOutOfRageMessage] = useState<string | null>(null);

  const employeeGetAll = Important.getAllEmployee;
  const [employees, setEmployees] = useState<any[] >([]);

  const defaultStartDate = moment().format("YYYY-MM-DD");
  const defaultEndDate = moment().add(1, "days").format("YYYY-MM-DD");
  const [dateDifference, setDateDifference] = useState<number | null>(null);

  const schema = yup.object({
    employeeId: yup
    .number()
    .typeError("Select an employee is required.")
    .required("Select an employee is required."),
    startDate: yup
      .string()
      .test(
        "is-utc-date",
        "Add a valid start date.",
        (value: any) => {
          const isValid = checkIfDateIsValid(value);
          if (isValid) 
            setValidatedStartDate(value)
          return isValid;
        }
      )
      .required("Start date is required."),
    endDate: yup
      .string()
      .test(
        "is-utc-date",
        "Add a valid end date.",
        (value: any) => {
          const isValid = checkIfDateIsValid(value);
          if (isValid) 
            setValidatedEndDate(value);
          return isValid;
        }
      )
      .test(
        "date-difference",
        "The duration between start date and end date must be at least 1 day.",
        function (value) {
          const startDate = moment.utc(this.parent.startDate, "YYYY-MM-DD", true);
          const endDate = moment.utc(value, "YYYY-MM-DD", true);

          const difference = endDate.diff(startDate, "days");
          setDateDifference(difference);
          return difference >= 1;
        }
      )
      .required("End date is required.")
  });

  
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      employeeId: ""
    },
    resolver: yupResolver(schema),
  });




  const onReset = (data: any) => {
    reset(data);
    setValidatedStartDate(defaultStartDate);
    setValidatedEndDate(defaultEndDate);
    setIsDifferenceOutOfRage(false);
    setDifferenceOutOfRageMessage(null);
    setIsNewDateSelected(false);
    setAvaliableDays(null);
  }

  const onChange = (data: any) => {
    if(checkIfDateIsValid(data.target.value)) {
      if(data.target.name === 'startDate') {
        setValidatedStartDate(data.target.value);
      }
      else if (data.target.name === 'endDate') {
        setValidatedEndDate(data.target.value);
      }
      setIsNewDateSelected(true);
    }
    else setDateDifference(null);
    
  }


  const onEmployeeChange = async (data: any) => {
    setAvaliableDays(employees.find(employees => employees.id === data.target.value)?.vacationDays);
  };

  const onSubmit = (data: any) => {
    const requestUrl = vacationRequestUrl+`/admincreate/vrequest`;;
    const putData = {
      startDate: data.startDate,
      endDate: data.endDate,
      employeeId: data.employeeId,
    };
      axios.put(requestUrl, putData, {
        headers: { "Content-Type": "application/json" }
      })
        .then((response) => {
          toast.success("Vacation request submitted successfully.");
          navigate('/vacation_request/view/'+response.data.id);
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
    
  };


  const getAllEmployees =  async () => {
    const requestUrl = employeeGetAll+'/vrequest/avaliable';
    try {
      const response = await axios.get(requestUrl);
      setEmployees(response.data);

    }
    catch(error: any) {
      console.error(error);
      toast.error(error?.response.data.message);
    }
  }


  const calculateDateDifference = () => {
    const startDate = moment.utc(validatedStartDate, "YYYY-MM-DD", true);
    const endDate = moment.utc(validatedEndDate, "YYYY-MM-DD", true);
    return  endDate.diff(startDate, "days") + 1;
  };

  const checkIfDateIsValid = (value: any) => {
    let result = moment.utc(value, true).isValid();
    return result;
  };

  const calculateNumberOfNonWorkingDays = (startDate: Date, endDate: Date): number => {
    let count = 0;
    const currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay(); 
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        count++; 
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return count;
  };
  

  const checkIfDifferenceIsOutOfRage = () => {
    if(dateDifference !==null) {
      if(dateDifference > 10) {
        setIsDifferenceOutOfRage(true);
        setDifferenceOutOfRageMessage("Έχετε ξεπεράσει το όριο αδειών που δικαιούστε.");
      }
      else if(dateDifference < 1) {
        setIsDifferenceOutOfRage(true);
        setDifferenceOutOfRageMessage("Οι ημέρες άδειας πρέπει να είναι τουλάχιστον 1.");
      }
      else {
        if(isDifferenceOutOfRage === true && differenceOutOfRageMessage!==null) {
          setIsDifferenceOutOfRage(false);
          setDifferenceOutOfRageMessage(null);
        }
      }
      setIsNewDateSelected(false);
    }
    
  };

useEffect(() => {
  getAllEmployees();
}, []);

 useEffect(() => {
  if (defaultStartDate && defaultEndDate) {
    setValidatedStartDate(defaultStartDate);
    setValidatedEndDate(defaultEndDate);
  }
}, [defaultStartDate, defaultEndDate]);

 useEffect(() => {
  if (validatedStartDate && validatedEndDate) {
    const difference = calculateDateDifference();
    const nonWorkingDays = calculateNumberOfNonWorkingDays(new Date(validatedStartDate), new Date(validatedEndDate));
    const vacationDays = difference - nonWorkingDays;
    setDateDifference(vacationDays);
  }
}, [validatedStartDate, validatedEndDate, isNewDateSelected]);

useEffect(() => {
  checkIfDifferenceIsOutOfRage();
}, [dateDifference]);

useEffect(() => {
  if(dateDifference!==null) 
    setIsLoading(false);
}, [dateDifference]);



  return (
    <div>
      {Display.displayIconButton()}
      { isLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={30} />
          </Box>
        ) : 
    ( employees !==null) ? (
    <>
      <h2>Add a new vacation request:</h2>
      <div style={{ marginTop: "20px", display: 'flex' }}>
        <Box
          sx={{
            width: "200px",
          }}
        >
          <form noValidate onChange={onChange} onReset={onReset} onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="employeeId"
            control={control}
            render={({ field }) => (
              <div>
                <Select
                  {...field}
                  labelId="employee-label"
                  id="employee-label"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => {
                    field.onChange(e);
                    onEmployeeChange(e);
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
          <div style={{marginTop:"20px"}}>
            <MuiTextField
              errors={errors}
              control={control}
              name="startDate"
              label="Start date"
            />
            <MuiTextField
              errors={errors}
              control={control}
              name="endDate"
              label="End date"
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
            </div>
          </form>
        </Box>
        <Box sx={{ marginLeft: "250px", width: "600px" }}>
          {
            (avaliableDays !==null && avaliableDays >= 1)  && (
              <div style={{ marginTop: "70px" }}>
                {Display.displayFieldWithTypography('Days (limit): ', avaliableDays, 1)}
                {
                  dateDifference !== null  && (
                    isDifferenceOutOfRage ? (
                      Display.displayFieldWithTypography(differenceOutOfRageMessage, '', 3)
                    ) : (
                      Display.displayFieldWithTypography('Vacation days: ', dateDifference, 2)
                    )
                  )
                }
              </div>
            )
          }
        </Box>
      </div>
    </>
  ) : (
    <h3>
      </h3>
  )
}
    </div>
  );
};

export default VacationRequestForm;
