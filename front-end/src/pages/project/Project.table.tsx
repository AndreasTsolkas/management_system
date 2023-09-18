import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IPost } from "./project.model";
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
  const projectTableUrl = Important.backEndProjectUrl;
  const projectGetAll = Important.getAllProject;

  useEffect(() => {
    axios
      .get(projectGetAll)
      .then((response) => {
        const data = response.data;
        setRows(
          data.map(
            (project: { id: any; name: any; description:any; date_started: any; date_to_finish:any  }) => {
              return {
                id: project.id,
                name: project.name,
                description: project.description,
                dateStarted: project.date_started,
                dateToFinish: project.date_to_finish,
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
       field: "description",
       headerName: "description",
       flex: 1,
    },
    {
        field: "dateStarted",
        headerName: "dateStarted",
        flex: 1,
      },
      {
        field: "dateToFinish",
        headerName: "dateToFinish",
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
              onClick={() => navigate(`/project/${cellValues?.row?.id}`)}
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
                    `${projectTableUrl}/${cellValues?.row?.id}`
                  )
                  .then(() => {
                    toast.error("deleted!");
                    axios
                      .get(projectGetAll)
                      .then((response) => {
                        const data = response.data;
                        setRows(
                          data.map(
                            (project: {
                              id: any;
                              name: any;
                              description:any; 
                              date_started: any; 
                              date_to_finish:any 
                              
                            }) => {
                              return {
                                id: project.id,
                                name: project.name,
                                description:project.description,
                                date_started: project.date_started,
                                date_to_finish: project.date_to_finish,
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
        <h2>Λίστα έργων</h2>
        <IconButton color="primary" onClick={() => navigate(`/project/new`)}>
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