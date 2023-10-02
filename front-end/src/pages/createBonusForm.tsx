import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import * as Important from "src/important";
import * as Display from "src/display";
import { Season } from "src/enums/season";
import { useEffect } from "react";

const schema = yup.object({
  employeeId: yup
    .number()
    .typeError("Η συμπλήρωση του user id είναι απαραίτητη.")
    .required("Η συμπλήρωση του user id είναι απαραίτητη."),
  season: yup
    .string()
    .typeError("Η συμπλήρωση της εποχής που ο εργαζόμενος θα πάρει το bonus είναι απαραίτητη.")
    .required("Η συμπλήρωση της εποχής που ο εργαζόμενος θα πάρει το bonus είναι απαραίτητη."),
});

const CreateBonusForm = () => {
  const bonusUrl = Important.backEndBonusUrl;
  const employeeGetAll = Important.getAllEmployee;
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

  const onSubmit = (data: any) => {
    const requestUrl = bonusUrl + `/create/bonus`;
    const putData = {
      employeeId: data.employeeId,
      season: data.season,
    };
      axios
        .put(requestUrl, putData)
        .then((response) => {
          toast.success("Bonuses created.");
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
  };

  const getAllEmployees =  async () => {
    const requestUrl = employeeGetAll;
    try {
      const response = axios.get(requestUrl);
    }
    catch(error: any) {
      console.error(error);
      toast.error(error?.response.data.message);
    }
  }

  useEffect(() => {
    getAllEmployees();
  }, []);


  return (
    <div>
      {Display.displayIconButton()}
      <h2>Δημιουργία bonus: </h2>
      <Box sx={{ width: "200px" }}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="employeeId"
            control={control}
            render={({ field }) => (
              <div>
              <TextField
                required
                {...field}
                label="employeeId"
                fullWidth
                variant="outlined"
                error={!!errors.employeeId}
                helperText={errors.employeeId?.message}
              />
              </div>
            )}
            
          />

          <Controller
            name="employeeId"
            control={control}
            render={({ field }) => (
              <div>
                <InputLabel htmlFor="season-label">Εργαζόμενος</InputLabel>
                <Select
                  {...field}
                  labelId="season-label"
                  id="season-label"
                  fullWidth
                  variant="outlined"
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

          <Controller
            name="season"
            control={control}
            render={({ field }) => (
              <div>
                <InputLabel htmlFor="season-label">Εποχή</InputLabel>
                <Select
                  {...field}
                  labelId="season-label"
                  id="season-label"
                  fullWidth
                  variant="outlined"
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
            Υποβολή
          </Button>
        </form>
      </Box>
      <div id="result"></div>
    </div>
  );
};

export default CreateBonusForm;