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
import moment from "moment";
import * as Important from "src/important";
import * as Display from "src/display";
import {hasAccessAuth, isAdminAuth} from "src/useAuth";

const BonusTable = () => {
  const isAdmin = true;
  const [rows, setRows] = useState<IPost[]>([]);
  const navigate = useNavigate();
  const bonusTableUrl = Important.backEndBonusUrl;
  const bonusGetAll = Important.getAllBonus;
  const [moreInformationLinkBase, setMoreInformationLinkBase] = useState<string>('');
  const [createNewBonusButtonDisabled, setCreateNewBonusButtonDisabled] = useState<boolean>(false);
  const [deleteDepartmentButtonDisabled, setDeleteDepartmentButtonDisabled] = useState<boolean>(false);

  hasAccessAuth();
  isAdminAuth();

  const columns: GridColDef[] = [
    { field: "id", headerName: "id", flex: 1 },
    {
      field: "employee",
      headerName: "Employee",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
    },

    {
      field: "date_given",
      headerName: "Datetime",
      flex: 1,
    },

    
    {
      field: "actions",
      headerName: "Actions",
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
                    toast.info("Bonus deleted successfully.");
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
                            }) => {
                              return {
                                id: bonus.id,
                                amount: bonus.amount,
                                employee: bonus.employee.name
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
            (bonus: { id: any; amount: any; dateGiven: any; employee: any }) => {
              return {
                id: bonus.id,
                amount: bonus.amount,
                date_given: moment(bonus.dateGiven).format('DD / MM / YYYY'),
                employee: bonus.employee.name+" "+bonus.employee.surname
              };
            }
          )
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  

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
        <h2>Bonuses</h2>
        <IconButton disabled={createNewBonusButtonDisabled} color="primary" onClick={() => navigate(`/createbonuses`)}>
          <AddIcon />
        </IconButton>
      </div>
      <Box sx={{ height: 500, width: 900 }}>
        {Display.displayDataGrid(rows ?? [], columns)}
      </Box>
    </div>
  );
};

export default BonusTable;