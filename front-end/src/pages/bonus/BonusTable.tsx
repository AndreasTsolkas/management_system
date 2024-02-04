import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IPost } from "./bonus.model";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import * as Important from "src/important";
import * as Display from "src/display";
import * as Datetime from "src/datetime";
import {hasAccessAuth, isAdminAuth} from "src/useAuth";
import { useCookies } from "react-cookie";
import { httpClient } from "src/requests";

const BonusTable = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const adminCookie = Important.adminCookie;
  const isAdmin = JSON.parse(cookies[adminCookie] || 'false');
  const [rows, setRows] = useState<IPost[]>([]);
  const bonusUrl = Important.bonusUrl;
  const bonusGetAll = Important.getAllBonus;
  const [moreInformationLinkBase, setMoreInformationLinkBase] = useState<string>('/bonus/view');
  const [createNewBonusButtonDisabled, setCreateNewBonusButtonDisabled] = useState<boolean>(false);
  const [deleteDepartmentButtonDisabled, setDeleteDepartmentButtonDisabled] = useState<boolean>(false);
  const [readyToDisplayPage, setReadyToDisplayPage] = useState<boolean>(false);

  const datetimeFormat = Important.datetimeFormat;

  hasAccessAuth();

  function setBonusRows(data: any) {
    
    
    setRows(
      data.map(
        (bonus: { id: any; amount: any; dateGiven: any; employee: any }) => {
          let name = '---';
          if(bonus.employee)
            name = bonus.employee.name+" "+bonus.employee.surname;
          return {
            id: bonus.id,
            amount: bonus.amount,
            date_given: Datetime.getDate(bonus.dateGiven, datetimeFormat),
            employee: name
          };
        }
      )
    );
  }

  async function getAllBonuses() {
    await httpClient.get(bonusGetAll)
      .then((response) => {
        const data = response.data;
        setBonusRows(data);
      })
      .catch((error) => {
        console.error(error);
      });
    setReadyToDisplayPage(true);
  }

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
              onClick={async () => {
                await httpClient.delete(
                  `${bonusUrl}/${cellValues?.row?.id}`
                )
                  .then(async () => {
                    toast.info("Bonus deleted successfully.");
                    await getAllBonuses();
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
    getAllBonuses();
  }, []);

  useEffect(() => {
    setCreateNewBonusButton();
  }, []);

  

  

  return (
    <div>
      {readyToDisplayPage ? (
        <>
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
      <>
        {Display.displayDataGrid(rows ?? [], columns)}
      </>
      </>
      ) : (
        <>
        {Display.DisplayLoader()}
        </>
      )}
    </div>
  );
};

export default BonusTable;