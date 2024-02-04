import { DataGrid } from "@mui/x-data-grid";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from "react-router-dom";
import { Box, Modal, Typography } from "@mui/material";



export function displayDataGrid(rows: any, columns: any) {

    return(

        <DataGrid 
        rows={rows ?? []} 
        columns={columns}
        initialState={{
          sorting: {
            sortModel: [{ field: 'id', sort: 'asc' }],
          },
        }}
         />

    );
}

export function displayIconButton(specialCase?: any) {
  const navigate = useNavigate();
  let redirectionPath: any = -1;
  if(specialCase) // Its a little unorthodox what I did here , but I did it because in a specific case navigate with the standart value (-1) as argument doesnt work
    redirectionPath = '/profile'; //
  const iconStyle = {
    cursor: 'pointer', 
  };
  return(
      <div style={{ position: 'relative', width: '100px', height: '30px' }}>
        <ArrowBackIcon
          onClick={() => navigate(redirectionPath)}
          color="primary"
          style={{
            ...iconStyle, 
            position: 'absolute',
   
          }}
        />
      </div>

  );
}

export const displayTitleWithTypography = (name: any) => {
  return (
    <Typography  variant="h2" gutterBottom>
        {name}
    </Typography>
  );
  
}

export const displayPrettyTitleWithTypography = (name: any) => {
  return (

    <Typography  variant="h5" gutterBottom>
        {name}
    </Typography>
 
  );
  
}

export const displayFieldWithTypography = (name: any, data: any, index: number) => {
  return (
    <Typography  variant="h6" key={index} >
       <strong>{name}</strong>    {data}
    </Typography>
  );
  
}



export function DisplayErrorMessage({ message }: { message: string }) {
  return <h4>{message}</h4>;
}

