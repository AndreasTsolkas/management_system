import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IPost } from "./department.model";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import axios from "axios";
import * as Important from "src/important";
import * as Display from "src/display";
import * as Layout from "src/basic_css.css";

const DepartmentTable = () => {
  const [rows, setRows] = useState<IPost[]>([]);
  const navigate = useNavigate();
  const departmentTableUrl = Important.backEndDepartmentUrl;
  const departmentGetAll = Important.getAllDepartment;

  useEffect(() => {
    axios
      .get(departmentGetAll)
      .then((response) => {
        const data = response.data;
        setRows(
          data.map(
            (department: { id: any; name: any;  }) => {
              return {
                id: department.id,
                name: department.name,
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
      field: "name",
      headerName: "name",
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
              onClick={() => navigate(`/department/${cellValues?.row?.id}`)}
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
                    `${departmentTableUrl}/${cellValues?.row?.id}`
                  )
                  .then(() => {
                    toast.error("deleted!");
                    axios
                      .get(departmentGetAll)
                      .then((response) => {
                        const data = response.data;
                        setRows(
                          data.map(
                            (department: {
                              id: any;
                              name: any;
                            }) => {
                              return {
                                id: department.id,
                                name: department.name,
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
        <h2>Λίστα τμημάτων</h2>
        <IconButton color="primary" onClick={() => navigate(`/department/new`)}>
          <AddIcon />
        </IconButton>
      </div>
      <Box sx={{ height: 500, width: 900 }}>
        {Display.displayDataGrid(rows ?? [], columns)}
      </Box>
    </div>
  );
};

export default DepartmentTable;