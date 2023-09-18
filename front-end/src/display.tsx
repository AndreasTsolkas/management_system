import { DataGrid } from "@mui/x-data-grid";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from "react-router-dom";



export function displayDataGrid(rows: any, columns: any) {

    return(

        <DataGrid 
        rows={rows ?? []} 
        columns={columns}
        initialState={{
          sorting: {
            sortModel: [{ field: 'id', sort: 'asc' }],
          },
        }} />

    );
}

export function displayIconButton() {
  const navigate = useNavigate();
  const iconStyle = {
    cursor: 'pointer', 
  };
  return(
      <div style={{ position: 'relative', width: '100px', height: '30px' }}>
        <ArrowBackIcon
          onClick={() => navigate(-1)}
          color="primary"
          style={{
            ...iconStyle, 
            position: 'absolute',
   
          }}
        />
      </div>

  );
}