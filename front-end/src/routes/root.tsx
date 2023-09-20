import { Link, Outlet } from "react-router-dom";


export default function Root() {

  const isAdmin = true;
  return (
    <>
      <div id="sidebar">
        <nav>
          <ul>
            <li style={{marginBottom: "30px"}}>
              <Link to={`/`}>Προφίλ</Link>
            </li>
            <li>
              <Link to={`/department`}>Τμήματα</Link>
            </li>
            <li>
              <Link to={`/employee`}>Εργαζόμενοι</Link>
            </li>
            <li>
              <Link to={`/user`}>Χρήστες</Link>
            </li>
            <li>
              <Link to={`/project`}>Έργα</Link>
            </li>
            <li>
              <Link to={`/bonus`}>Bonus</Link>
           </li>
            <li>
              <Link to={`/vacation_request`}>Άδειες</Link>
            </li>
          </ul>
          
          {isAdmin ? (
  <ul style={{ marginTop: "30px" }}>
    <li>
      <Link to={`/pvacation_request`}>Εκρεμμείς άδειες</Link>
    </li>
    <li>
      <Link to={`/createbonuses`}>Δημιουργία bonus</Link>
    </li>
  </ul>
) : (
  <ul style={{ marginTop: "30px" }}>
  <li>
    <Link to={`/uservacationrequest`}>Νέα αίτηση άδειας</Link>
  </li>
  </ul>
)}







         
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
