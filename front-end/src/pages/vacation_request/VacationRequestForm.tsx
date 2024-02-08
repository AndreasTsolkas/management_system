	

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
import * as Datetime from "src/datetime";
import moment from "moment";
import {hasAccessAuth, isAdminAuth, isAccessTokenNotExpired} from "src/useAuth";
import { httpClient } from "src/requests";
import { DisplayFieldWithTypography, DisplayIconButton, DisplayViewTitle } from "src/display";


const VacationRequestForm = () => {

  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const vacationRequestUrl = Important.vacationRequestUrl;
  const employeeUrl = Important.employeeUrl;
  const [avaliableDays, setAvaliableDays] = useState<number | null>(null);
  const [validatedStartDate, setValidatedStartDate] = useState<any | null>(null);
  const [validatedEndDate, setValidatedEndDate] = useState<any | null>(null);
  const [isNewDateSelected, setIsNewDateSelected] = useState<boolean>(false);
  const [isDifferenceOutOfRage, setIsDifferenceOutOfRage] = useState<boolean>(false);
  const [differenceOutOfRageMessage, setDifferenceOutOfRageMessage] = useState<string | null>(null);

  const employeeGetAll = Important.getAllEmployee;
  const [employees, setEmployees] = useState<any[] >([]);

  const datetimeFormat = Important.datetimeFormat2;

  const defaultStartDate = Datetime.getCurrentDate(datetimeFormat);
  const defaultEndDate = Datetime.getDateFromCurrentDate(1, datetimeFormat);
  const [dateDifference, setDateDifference] = useState<number | null>(null);

  hasAccessAuth();
  isAdminAuth();

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
          const startDate = Datetime.getUTCdate(this.parent.startDate, datetimeFormat);;
          const endDate = Datetime.getUTCdate(value, datetimeFormat);

          const difference = Datetime.calculateDateDifference(startDate, endDate);
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

  const onSubmit = async (data: any) => {
    const requestUrl = vacationRequestUrl+`/admincreate/vrequest`;;
    const putData = {
      startDate: data.startDate,
      endDate: data.endDate,
      employeeId: data.employeeId,
    };
      await httpClient.put(requestUrl, putData)
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
      const response = await httpClient.get(requestUrl);
      setEmployees(response.data);

    }
    catch(error: any) {
      console.error(error);
      toast.error(error?.response.data.message);
    }
  }


  const calculateDateDifference = () => {
    const startDate = Datetime.getUTCdate(validatedStartDate, datetimeFormat);
    const endDate = Datetime.getUTCdate(validatedEndDate, datetimeFormat);
    return Datetime.calculateDateDifference(startDate, endDate)+1;
  };

  const checkIfDateIsValid = (value: any) => {
    let result = Datetime.checkIfDateIsValid(value);
    return result;
  };

  const calculateNumberOfNonWorkingDays = (startDate: Date, endDate: Date): number => {
    let count = 0;
    const currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      const dayOfWeek = Datetime.getDayNumberFromDayName(currentDate); 
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
        setDifferenceOutOfRageMessage("You have exceeded the limit of vacation days to which this employee is entitled.");
      }
      else if(dateDifference < 1) {
        setIsDifferenceOutOfRage(true);
        setDifferenceOutOfRageMessage("Vacation days must be at least 1.");
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
      {Display.DisplayIconButton()}
      { isLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={30} />
          </Box>
        ) : 
    ( employees !==null) ? (
    <>
      <DisplayViewTitle text='Add a new leave: ' />
      <div >
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
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
        <Box sx={{ marginLeft:"250px", width: "50%" }}>
          {
            (avaliableDays !==null && avaliableDays >= 1)  && (
              <div style={{ marginTop: "70px" }}>
                <DisplayFieldWithTypography name={'Days (limit): '}  data={avaliableDays} index={1} />
                {
                  dateDifference !== null  && (
                    isDifferenceOutOfRage ? (
                      <DisplayFieldWithTypography name={differenceOutOfRageMessage}  data={''} index={3} />
                    ) : (
                      <DisplayFieldWithTypography name={'Vacation days: '}  data={dateDifference} index={2} />
                    )
                  )
                }
              </div>
            )
          }
        </Box>
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
