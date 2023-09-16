import { FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { addErrorIntoField } from "../utils";
import ErrorMessage from "./ErrorMessage";

interface MuiTextFieldProps {
  label: string;
  inputProps?: any;
  control: any;
  name: string;
  errors: any;
}
const MuiTextField = ({
  label,
  inputProps,
  control,
  name,
  errors,
}: MuiTextFieldProps) => {
  return (
    <FormControl fullWidth sx={{ mb: "1rem" }}>
      <Controller
        name={name}
        control={control}
        render={({ field }: any) => (
          <TextField
            {...field}
            {...addErrorIntoField(errors[name])}
            required
            label={label}
            variant="outlined"
            InputProps={inputProps}
          />
        )}
      />
      {errors[name] ? <ErrorMessage message={errors[name].message} /> : null}
    </FormControl>
  );
};

export default MuiTextField;
