import Logins from "../other/Login";
import Navbar from "../other/Navbar";
import TableUnavailable from "../other/TableUnavailable";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useRestaurant } from "../context/RestaurantContext";
const Login = () => {
    const { token } = useParams();
    const [available, setAvailable] = useState(null);
    const [qrTableNumber, setQrTableNumber] = useState(null);
    const { setTableNumber } = useRestaurant();

    useEffect(() => {
      if (token) {
        localStorage.setItem("customerQrToken", token);
      }
      setTableNumber(null);

      async function checkTable() {
        try {
          const { data } = await axios.get(`http://localhost:8000/table/available/${token}`);
          setAvailable(data.available);
          if (Number.isInteger(data.tableNumber) && data.tableNumber > 0) {
            setQrTableNumber(data.tableNumber);
            setTableNumber(data.tableNumber);
          } else {
            setQrTableNumber(null);
          }
        } catch (e) {
          console.error("Could not check table availability", e);
          setAvailable(false);
        }
      }

      if (token) {
        checkTable();
      }
    }, [token, setTableNumber]);

    return (
      <>
        <Navbar />
        {available === null ? null : available ? <Logins qrToken={token} qrTableNumber={qrTableNumber} /> : <TableUnavailable />}
      </>
    );
}

export default Login