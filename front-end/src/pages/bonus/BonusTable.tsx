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
import moment from "moment";

const BonusTable = () => {
  const isAdmin = false;
  const [rows, setRows] = useState<IPost[]>([]);
  const navigate = useNavigate();
  const bonusTableUrl = Important.backEndBonusUrl;
  const bonusGetAll = Important.getAllBonus;
  const [moreInformationLinkBase, setMoreInformationLinkBase] = useState<string>('');
  const [createNewBonusButtonDisabled, setCreateNewBonusButtonDisabled] = useState<boolean>(false);
  const [deleteDepartmentButtonDisabled, setDeleteDepartmentButtonDisabled] = useState<boolean>(false);

  function setCreateNewBonusButton() {
    if(!isAdmin) {
      setCreateNewBonusButtonDisabled(true);
      setDeleteDepartmentButtonDisabled(true);
    }
  }

  useEffect(() => {
    setCreateNewBonusButton();
  }, []);

  useEffect(() => {
    setMoreInformationLinkBase('/bonus/view');
    axios
      .get(bonusGetAll)
      .then((response) => {
        const data = response.data;
        setRows(
          data.map(
            (bonus: { id: any; amount: any; dateGiven: any; employee: any; department: any }) => {
              return {
                id: bonus.id,
                amount: bonus.amount,
                date_given: moment(bonus.dateGiven).format('DD / MM / YYYY'),
                employee: bonus.employee.name+" "+bonus.employee.surname,
                department: bonus.employee.department.name,
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
      headerName: "Εργαζόμενος",
      flex: 1,
    },
    {
        field: "department",
        headerName: "Τμήμα εργαζομένου",
        flex: 1,
      },
    {
      field: "amount",
      headerName: "Ποσό",
      flex: 1,
    },

    {
      field: "date_given",
      headerName: "Ημερομηνία",
      flex: 1,
    },

    
    {
      field: "actions",
      headerName: "Ενέργειες",
      flex: 1,
      renderCell: (cellValues) => {
        let deleteIconDisabled = false;
        if(deleteDepartmentButtonDisabled===true) 
          deleteIconDisabled = true;
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => navigate(`${moreInformationLinkBase}/${cellValues?.row?.id}`)}
            >
              <ReadMoreIcon />
            </IconButton>
            <IconButton
              disabled ={deleteIconDisabled}
              color="warning"
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
                                department: bonus.employee.department.name
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
        <h2>Λίστα bonus</h2>
        <IconButton disabled={createNewBonusButtonDisabled} color="primary" onClick={() => navigate(`/createbonuses`)}>
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