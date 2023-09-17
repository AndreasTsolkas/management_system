import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, IconButton, Switch } from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IPost } from "./vacationRequest.model";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import axios from "axios";
import * as Important from "src/important";
import * as Display from "src/display";

const PendingVacationRequestTable = () => {
  const [rows, setRows] = useState<IPost[]>([]);
  const navigate = useNavigate();
  const vacationRequestTable = Important.backEndVacationRequestUrl;
  const vacationRequestUrl = Important.getAllVacationRequest;
  const vacationRequestStatus = 'pending';
  const getVacationRequestByStatus = vacationRequestTable+'/by/status?status='+vacationRequestStatus;
  console.log(getVacationRequestByStatus);

  useEffect(() => {
    axios
      .get(getVacationRequestByStatus)
      .then((response) => {
        const data = response.data;
        setRows(
          data.map(
            (vacationRequest: { id: any; employee: any; startDate: any; endDate: any, status: any, days: any }) => {
              return {
                id: vacationRequest.id,

                employee: vacationRequest.employee.name,
                startDate: vacationRequest.startDate,
                endDate: vacationRequest.endDate,
                days: vacationRequest.days,
              };
            }
          )
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "id", flex: 1 },
    {
      field: "employee",
      headerName: "employee",
      flex: 1,
    },
    {
      field: "startDate",
      headerName: "startDate",
      flex: 1,
    },
    {
      field: "endDate",
      headerName: "endDate",
      flex: 1,
    },
      {
        field: "days",
        headerName: "days",
        flex: 1,
      },
    {
      field: "actions",
      headerName: "Αποδοχή ",
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <>
            <Switch  size="small" />
        
          </>
        );
      },
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: 900,
        }}
      >
        <h2>Εκρεμμείς άδειες</h2>
        <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          > Υποβολή αλλαγών</Button>
      </div>
      <Box sx={{ height: 500, width: 900 }}>
        {Display.displayDataGrid(rows ?? [], columns)} 
      </Box>
    </div>
  );
};

export default PendingVacationRequestTable;