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
import { difference } from "lodash";




const UserVacationRequestForm = () => {

  
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const vacationRequestUrl = Important.backEndVacationRequestUrl;
  const employeeUrl = Important.backEndEmployeeUrl;
  const [result, setResult] = useState<any | null>(null);
  const [isEmployeeOnVacation, setIsEmployeeOnVacation] = useState<boolean>(false);
  const [hasMadeRequestRecently, setHasMadeRequestRecently] = useState<boolean>(false);
  const [avaliableDays, setAvaliableDays] = useState<number | null>(null);
  const [validatedStartDate, setValidatedStartDate] = useState<any | null>(null);
  const [validatedEndDate, setValidatedEndDate] = useState<any | null>(null);
  const [isNewDateSelected, setIsNewDateSelected] = useState<boolean>(false);
  const [isDifferenceOutOfRage, setIsDifferenceOutOfRage] = useState<boolean>(false);
  const [differenceOutOfRageMessage, setDifferenceOutOfRageMessage] = useState<string | null>(null);

  const userId = 1;

  const defaultStartDate = moment().format("YYYY-MM-DD");
  const defaultEndDate = moment().add(1, "days").format("YYYY-MM-DD");
  const [dateDifference, setDateDifference] = useState<number | null>(null);

  const schema = yup.object({
    startDate: yup
      .string()
      .test(
        "is-utc-date",
        "Προσθέστε μια έγκυρη ημερομηνία έναρξης.",
        (value: any) => {
          const isValid = checkIfDateIsValid(value);
          if (isValid) 
            setValidatedStartDate(value)
          return isValid;
        }
      )
      .required("Η ημερομηνία έναρξης είναι απαραίτητη."),
    endDate: yup
      .string()
      .test(
        "is-utc-date",
        "Προσθέστε μια έγκυρη ημερομηνία λήξης.",
        (value: any) => {
          const isValid = checkIfDateIsValid(value);
          if (isValid) 
            setValidatedEndDate(value);
          return isValid;
        }
      )
      .test(
        "date-difference",
        "Η διάρκεια πρέπει να είναι τουλάχιστον 1 ημέρα.",
        function (value) {
          const startDate = moment.utc(this.parent.startDate, "YYYY-MM-DD", true);
          const endDate = moment.utc(value, "YYYY-MM-DD", true);

          const difference = endDate.diff(startDate, "days");
          setDateDifference(difference);
          return difference >= 1;
        }
      )
      .required("Η ημερομηνία λήξης είναι απαραίτητη.")
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

  const onSubmit = (data: any) => {
    const requestUrl = vacationRequestUrl+`/usercreate/vrequest`;
    console.log(requestUrl);
    const putData = {
      startDate: data.startDate,
      endDate: data.endDate,
      employeeId: userId,
    };
      axios.put(requestUrl, putData, {
        headers: { "Content-Type": "application/json" }
      })
        .then(() => {
          toast.success("Η αίτηση άδειας καταχωρήθηκε με επιτυχία.");
          
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
    
  };

  const getUserData = async () => {
    try {
      const response: any = await axios.get(`${employeeUrl}/isonvacation/${userId}`);
      setResult(response.data);
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
    const startDate = moment.utc(validatedStartDate, "YYYY-MM-DD", true);
    const endDate = moment.utc(validatedEndDate, "YYYY-MM-DD", true);
    return endDate.diff(startDate, "days");
  };

  const checkIfDateIsValid = (value: any) => {
    let result = moment.utc(value, true).isValid();
    return result;
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
    setDateDifference(difference);
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
    ( avaliableDays !==null && avaliableDays >= 1 ) ? (
      <>
      {
        !isEmployeeOnVacation ? (
          <>
  {
    !hasMadeRequestRecently ? (
      <>
        <h2>Νέα αίτηση άδειας:</h2>
        <div style={{ marginTop: "20px", display: 'flex' }}>
          <Box
            sx={{
              width: "200px",
            }}
          >
            <form noValidate onChange={onChange} onReset={onReset} onSubmit={handleSubmit(onSubmit)}>
              <MuiTextField
                errors={errors}
                control={control}
                name="startDate"
                label="Ημερομηνία έναρξης"
              />
              <MuiTextField
                errors={errors}
                control={control}
                name="endDate"
                label="Ημερομηνία λήξης"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Υποβολή
              </Button>
              <Button
                type="reset"
                fullWidth
                variant="outlined"
              >
                Ανανέωση
              </Button>
            </form>
          </Box>
          <Box sx={{ marginLeft: "250px", width: "600px" }}>
            {
              result != null && (
                <div style={{ marginTop: "70px" }}>
                  {Display.displayFieldWithTypography('Όριο ημερών: ', result.employee.vacationDays, 1)}
                  {
                    dateDifference !== null && (
                      isDifferenceOutOfRage ? (
                        Display.displayFieldWithTypography(differenceOutOfRageMessage, '', 3)
                      ) : (
                        Display.displayFieldWithTypography('Ημέρες άδειας: ', dateDifference, 2)
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
      <h3>Υποβάλλατε πρόσφατα αίτηση άδειας. Δεν έχετε δικαίωμα να υποβάλλετε ξανά.</h3>
    )
  }
</>
        ) : (
          <h3>Βρισκόσαστε ήδη σε άδεια. Δεν έχετε δικαίωμα να υποβάλλετε καινούρια αίτηση.</h3>
        )
      }
    </>
  ) : (
    <h3>
      Έχετε εξαντλήσει όλες τις ημέρες άδειας. Δεν έχετε δικαίωμα να υποβάλετε νέα αίτηση άδειας.</h3>
  )
}
    </div>
  );
};

export default UserVacationRequestForm;
