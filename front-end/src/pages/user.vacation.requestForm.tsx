import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import MuiTextField from "../components/MuiTextField";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import moment from 'moment';
import { DayPicker } from "react-day-picker";
import { format } from 'date-fns';


import * as Important from "src/important";
import * as Display from "src/display";
import * as Datetime from "src/datetime";
import { difference } from "lodash";
import {hasAccessAuth, isAdminAuth} from "src/useAuth";
import { httpClient } from "src/requests";
import { DisplayFieldWithTypography, DisplayViewTitle } from "src/display";




const UserVacationRequestForm = () => {

  
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const vacationRequestUrl = Important.vacationRequestUrl;
  const employeeUrl = Important.employeeUrl;
  const profileUrl = Important.profileUrl;
  const [result, setResult] = useState<any | null>(null);
  const [isEmployeeOnVacation, setIsEmployeeOnVacation] = useState<boolean | null>(null);
  const [hasMadeRequestRecently, setHasMadeRequestRecently] = useState<boolean | null>(null);
  const [avaliableDays, setAvaliableDays] = useState<number | null>(null);
  const [validatedStartDate, setValidatedStartDate] = useState<any | null>(null);
  const [validatedEndDate, setValidatedEndDate] = useState<any | null>(null);
  const [isNewDateSelected, setIsNewDateSelected] = useState<boolean>(false);
  const [isDifferenceOutOfRage, setIsDifferenceOutOfRage] = useState<boolean>(false);
  const [differenceOutOfRageMessage, setDifferenceOutOfRageMessage] = useState<string | null>(null);
  const [readyToDisplayPage, setReadyToDisplayPage] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);

  const datetimeFormat = Important.datetimeFormat2;


  const defaultStartDate = Datetime.getCurrentDate(datetimeFormat);
  const defaultEndDate = Datetime.getDateFromCurrentDate(1, datetimeFormat);
  const [dateDifference, setDateDifference] = useState<number | null>(null);

  hasAccessAuth();
  isAdminAuth(true); // I pass 'true' as argument on the 'reverse' parameter. Cause, in this case, I want to redirect the user if is admin

  const schema = yup.object({
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
        "Duration must be at least 1 day.",
        function (value) {
          const startDate = Datetime.getUTCdate(this.parent.startDate, datetimeFormat);
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

  const onSubmit = async (data: any) => {
    const requestUrl = vacationRequestUrl+`/usercreate/vrequest`;
    const putData = {
      startDate: data.startDate,
      endDate: data.endDate,
      employeeId: userId,
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

  const getUserData = async () => {
    try {
      const response: any = await httpClient.get(`${profileUrl}/amionvacation`);
      setResult(response.data);
      setUserId(response.data.id);
    }
    catch(error: any) {
      console.error(error);
      toast.error(error.response.data.message);
    }

  }

  const setIsEmployeeOnVacationState = () => {
    if(result!==null) {
      setIsEmployeeOnVacation(result.isOnVacation);
      setHasMadeRequestRecently(result.hasMadeRequestRecently);
    }
  };

  const setUserAvaliableDays = () => {
    if(result!==null) 
      setAvaliableDays(result.employee.vacationDays);
  };

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
        setDifferenceOutOfRageMessage("You have exceeded the limit of vacation days to which you are entitled.");
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
   getUserData();
 }, [userId]);

 useEffect(() => {
  setIsEmployeeOnVacationState();
}, [result]);

 useEffect(() => {
   setUserAvaliableDays();
 }, [result]);

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
  if(avaliableDays!=null && isEmployeeOnVacation !=null && hasMadeRequestRecently!=null)
    setReadyToDisplayPage(true);
}, [avaliableDays, isEmployeeOnVacation, hasMadeRequestRecently]);




return (
  <div>
    {readyToDisplayPage ? (
        <>
    {avaliableDays !== null && avaliableDays >= 1 ? (
      <>
        {!isEmployeeOnVacation ? (
          <>
            {!hasMadeRequestRecently ? (
              <>
                <DisplayViewTitle text='Request a new leave: ' />
                <div>
                  <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                    <Box sx={{ width: "200px" }}>
                      <form noValidate onChange={onChange} onReset={onReset} onSubmit={handleSubmit(onSubmit)}>
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
                      </form>
                    </Box>
                    <Box sx={{ marginLeft: "250px", width: "50%" }}>
                      {result != null && (
                        <div style={{ marginTop: "70px" }}>
                          <DisplayFieldWithTypography name={'Days limit: '} data = {result.employee.vacationDays} index={1} />
                          {dateDifference !== null && (
                            isDifferenceOutOfRage ? (
                              <DisplayFieldWithTypography name={differenceOutOfRageMessage} data = {''} index={3} />
                            ) : (
                              <DisplayFieldWithTypography name={'Vacation days: '} data = {dateDifference} index={2} />
                            )
                          )}
                        </div>
                      )}
                    </Box>
                  </Box>
                </div>
              </>
            ) : (
      
              <h3>You recently applied for a leave. You are not eligible to resubmit.</h3>
            )}
          </>
        ) : (
 
          <h3>You were already on leave. You do not have the right to submit a new application.</h3>
        )}
      </>
    ) : (

      <h3>You have used up all your vacation days. You are not eligible to submit a new leave application.</h3>
    )}
    </>
  ) : (
    <>
    {Display.DisplayLoader()}
    </>
  )}
  </div>
);
};

export default UserVacationRequestForm;
