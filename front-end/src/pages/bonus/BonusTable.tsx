import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IPost } from "./bonus.model";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import axios from "axios";
import * as Important from "src/important";

const BonusTable = () => {
  const [rows, setRows] = useState<IPost[]>([]);
  const navigate = useNavigate();
  const bonusTableUrl = Important.backEndBonusUrl;
  const bonusGetAll = Important.getAllBonus;

  useEffect(() => {
    axios
      .get(bonusGetAll)
      .then((response) => {
        const data = response.data;
        setRows(
          data.map(
            (bonus: { id: any; amount: any; employee: any; department: any }) => {
              return {
                id: bonus.id,
                amount: bonus.amount,
                employee: bonus.employee.name,
                department: bonus.department.name,
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
      field: "amount",
      headerName: "amount",
      /*type: "number",*/
      flex: 1,
    },
    {
      field: "employee",
      headerName: "employee",
      flex: 1,
    },
    {
        field: "department",
        headerName: "department",
        flex: 1,
      },
    {
      field: "actions",
      headerName: "actions",
      flex: 0.5,
      renderCell: (cellValues) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => navigate(`/bonus/${cellValues?.row?.id}`)}
            >
              <ReadMoreIcon />
            </IconButton>
            <IconButton
              style={{
                color: "red",
              }}
              onClick={() => {
                axios
                  .delete(
                    `${bonusTableUrl}/${cellValues?.row?.id}`
                  )
                  .then(() => {
                    toast.error("deleted!");
                    axios
                      .get(bonusGetAll)
                      .then((response) => {
                        const data = response.data;
                        setRows(
                          data.map(
                            (bonus: {
                              id: any;
                              amount: any;
                              employee: any;
                              department: any;
                            }) => {
                              return {
                                id: bonus.id,
                                amount: bonus.amount,
                                employee: bonus.employee.name,
                                department: bonus.department.name
                              };
                            }
                          )
                        );
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  });
              }}
            >
              <DeleteIcon />
            </IconButton>
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
        <h2>Λίστα bonuss</h2>
        <IconButton color="primary" onClick={() => navigate(`/bonus/new`)}>
          <AddIcon />
        </IconButton>
      </div>
      <Box sx={{ height: 500, width: 900 }}>
        <DataGrid rows={rows ?? []} columns={columns} />
      </Box>
    </div>
  );
};

export default BonusTable;