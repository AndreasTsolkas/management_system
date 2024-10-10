import { DataGrid } from "@mui/x-data-grid";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Navigation, useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Modal, Typography } from "@mui/material";



export function DisplayDataGrid({rows, columns}:{rows: any, columns: any}) {



  return (
    <Box sx={{ height: 500, width: 900 }}>
      <DataGrid
        rows={rows ?? []}
        columns={columns}
        autoHeight={rows.length <= 8} 
        style={{
          overflowX: 'hidden',
          overflowY: rows.length > 8 ? 'scroll' : 'hidden',  
          maxHeight: rows.length > 8 ? 416 : 'auto', 
        }}
        initialState={{
          sorting: {
            sortModel: [{ field: 'id', sort: 'asc' }],
          },
        }}
        columnVisibilityModel={{
          id: false,
        }}
      />
    </Box>
  );
}

export function DisplayIconButton(specialCase?: boolean, navigate?: any) {
  if(!navigate)  navigate = useNavigate();
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

export const displayTitleWithTypography = (name:string) => {
  return (
    <Typography  variant="h5" gutterBottom>
        {name}
    </Typography>
  );
  
}

export const displaySmallTitleWithTypography = (name:string) => {
  return (
    <Typography  variant="h6" gutterBottom>
        {name}
    </Typography>
  );
  
}

export const DisplayTableTitle = ({ text }: { text: string }) => {
  return (
    <div style={{ marginLeft: '350px', marginTop: '20px', marginBottom: '20px' }}>
      {displayTitleWithTypography(text)}
    </div>
  );
};

export const DisplayGenericTitle = ({text}:{text:string}) => {
  return displayTitleWithTypography(text);
}

export const DisplaySmallGenericTitle = ({text}:{text:string}) => {
  return displaySmallTitleWithTypography(text);
}

export const DisplayViewTitle = ({text}:{text:string}) => {
  return (

    <div style={{marginTop:'15px', marginBottom:'25px'}}>
      {displayTitleWithTypography(text)}
    </div>
 
  );
  
}


export const DisplayFieldWithTypography = ({name, data, index}:{name: string | null, data: any, index: number}) => {
  return (
    <Typography  variant="h6" key={index} >
       <strong>{name}</strong> {data}
    </Typography>
  );
  
}


export function DisplayErrorMessage({ message }: { message: string }) {
  return <h4>{message}</h4>;
}

export function DisplayLoader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
}

