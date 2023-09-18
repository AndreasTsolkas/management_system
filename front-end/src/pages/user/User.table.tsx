import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IPost } from "./user.model";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import axios from "axios";
import * as Important from "src/important";
import * as Display from "src/display";
import * as Layout from "src/basic_css.css";

const UserTable = () => {
  const [rows, setRows] = useState<IPost[]>([]);
  const navigate = useNavigate();
  const userTableUrl = Important.backEndUserRequestUrl;
  const userGetAll = Important.getAllUserRequest;

  useEffect(() => {
    axios
      .get(userGetAll)
      .then((response) => {
        const data = response.data;
        setRows(
          data.map(
            (user: { id: any; employee: any; isAdmin: boolean; isAccepted: boolean; }) => {
              return {
                id: user.id,
                employee: user.employee.name,
                isAdmin: user.isAdmin,
                isAccepted: user.isAccepted,
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
      field: "isAdmin",
      headerName: "isAdmin",
      flex: 1,
    },
    {
      field: "isAccepted",
      headerName: "isAccepted",
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
              onClick={() => navigate(`/user/${cellValues?.row?.id}`)}
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
                    `${userTableUrl}/${cellValues?.row?.id}`
                  )
                  .then(() => {
                    toast.error("deleted!");
                    axios
                      .get(userGetAll)
                      .then((response) => {
                        const data = response.data;
                        setRows(
                          data.map(
                            (user: {
                              id: any;
                              employee: any; 
                              isAdmin: boolean; 
                              isAccepted: boolean;
                            }) => {
                              return {
                                id: user.id,
                                employee: user.employee.name,
                                isAdmin: user.isAdmin,
                                isAccepted: user.isAccepted,
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
        <h2>Λίστα χρηστών</h2>
        <IconButton color="primary" onClick={() => navigate(`/user/new`)}>
          <AddIcon />
        </IconButton>
      </div>
      <Box sx={{ height: 500, width: 900 }}>
        {Display.displayDataGrid(rows ?? [], columns)}
      </Box>
    </div>
  );
};

export default UserTable;