import Logins from "../other/Login";
import Navbar from "../other/Navbar";
import TableUnavailable from "../other/TableUnavailable";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
const Login = () => {
    const { token } = useParams();
    const [available, setAvailable] = useState(null);

    useEffect(() => {
      async function checkTable() {
        try {
          const { data } = await axios.get(`http://localhost:8000/table/available/${token}`);
          setAvailable(data.available);
        } catch (e) {
          console.log(e);
          setAvailable(false);
        }
      }

      if (token) {
        checkTable();
      }
    }, [token]);

    return (
      <>
        <Navbar />
        {available === null ? null : available ? <Logins /> : <TableUnavailable />}
      </>
    );
}

export default Login