import { FormControl, FormLabel, Select, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { addErrorIntoField } from "../utils";
import ErrorMessage from "./ErrorMessage";

interface MuiTextFieldProps {
  label: string;
  inputProps?: any;
  control: any;
  name: string;
  errors: any;
  children?: any;
}
const MuiTextField = ({
  label,
  inputProps,
  control,
  name,
  errors,
  children,
}: MuiTextFieldProps) => {
  return (
    <FormControl fullWidth sx={{ mb: "1rem" }}>
      <FormLabel>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }: any) => (
          <Select
            {...field}
            {...addErrorIntoField(errors[name])}
            required
            variant="outlined"
            InputProps={inputProps}
          >
            {children}
          </Select>
        )}
      />
      {errors[name] ? <ErrorMessage message={errors[name].message} /> : null}
    </FormControl>
  );
};

export default MuiTextField;
