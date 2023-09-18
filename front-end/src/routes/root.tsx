import { Link, Outlet } from "react-router-dom";


export default function Root() {

  return (
    <>
      <div id="sidebar">
        <nav>
          <ul>
            <li>
              <Link to={`/`}>Home</Link>
            </li>
            <li>
              <Link to={`/department`}>Τμήματα</Link>
            </li>
            <li>
              <Link to={`/employee`}>Εργαζόμενοι</Link>
            </li>
            <li>
  <Link to={`/bonus`}>Bonus</Link>

</li>
<li>
              <Link to={`/vacation_request`}>Άδειες</Link>
            </li>

            
          </ul>
          <ul style={{marginTop: "30px"}}>
            <li>
              <Link to={`/pvacation_request`}>Εκρεμμείς άδειες</Link>
            </li>
            <li>
              <Link to={`/vacationrequest`}>Νέα αίτηση άδειας</Link>
            </li>
            <li>
              <Link to={`/createbonuses`}>Δημιουργία bonus</Link>
            </li>
          </ul>
         
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
