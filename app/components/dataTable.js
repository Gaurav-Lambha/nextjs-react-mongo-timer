import Link from "next/link";
import React, { useEffect, useState } from "react";
import Moment from 'react-moment';
import 'moment-timezone';

const DataTable = ({ cols = [], rows = [], timeZone={}}) => {
  const [activeTimer, setActiveTime] = useState(rows);
  const [deleteTimer, setDeleteTime] = useState(rows);
  const [activeTimerCols, setActiveTimeCols] = useState(cols);
  const [deleteTimerCols, setDeleteTimerCols] = useState(cols);
  const [currentDateTime, SetCurrentDateTime] = useState(new Date());

  useEffect(() => {
    if (rows && rows.length) {
      const activeData = rows.filter(e => !e.isExpire);
      const deletedData = rows.filter(e => e.isExpire);
      setActiveTime(activeData);
      setDeleteTime(deletedData);
    }
    if (cols && cols.length) {
      const activeDataCols = cols.filter(e => e !== 'DELETE DATE');
      setActiveTimeCols(activeDataCols);
    }
  }, [rows, cols])

  React.useEffect(() => {
    const timer = setInterval(() => { // Creates an interval which will update the current data every sec
    // This will trigger a rerender every component that uses the useDate hook.
    SetCurrentDateTime(new Date());
  }, 1000);
  return () => {
    clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
  }
}, []);

  const handlerDelete = async (id) => {
    if (confirm("Are you sure you want to delete")) {
      try {
        const res = await fetch(`../api/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          throw new Error("Couldn't delete");
        }

        const { message } = await res.json();
        alert(message);
        const deletedRow = deleteTimer.filter(e => e._id != id);
        setDeleteTime(deletedRow);
      } catch (error) {
        alert("Error deleting");
      }
    }
  };

  const handelStopTimer = async (id) => {
    if (confirm("Are you sure you want to Remove")) {
      try {
        const data = { isExpire: true, endDateTime: new Date() };
        const res = await fetch(`../api/${id}/`, {
          method: "POST",
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          throw new Error("Failed to update timer");
        }

        const { message } = await res.json();
        const activeTimerBck = activeTimer.filter(e => e._id != id);
        setActiveTime(activeTimerBck);

        const deleteTimerRow = activeTimer.find(e => e._id == id);
        deleteTimerRow['isExpire'] = data.isExpire;
        deleteTimerRow['endDateTime'] = data.endDateTime;
        setDeleteTime([...[deleteTimerRow], ...deleteTimer]);
        alert(message);
      } catch (error) {
        console.log("Failed to update timer", error);
        alert("Failed to update timer");
      }
    }
  };




  const renderGrid = (colData, rowData, isActive = true) => {    
    const activeDurations = (tr) => {
      return <Moment tz={timeZone?.timeZone} duration={tr?.startDateTime}  date={currentDateTime}/>
    }
    return <table className="table">
      <thead>
        <tr className="table-primary">
          {colData.map((th, i) => (
            <th key={i}>{th}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rowData.map((tr, i) => (
          <tr key={i}>
            <td>{i + 1}.</td>
            <td>{tr?.timerName}</td>
            <td> <Moment tz={timeZone?.timeZone} format="DD/MM/YYYY LT">{tr?.startDateTime}</Moment></td>
            <td> {isActive ?  activeDurations(tr):
                  <Moment tz={timeZone?.timeZone} duration={tr?.startDateTime} date={tr?.endDateTime}/> 
             } </td>
            <td>  <Moment tz={timeZone?.timeZone} format="DD/MM/YYYY LT">{tr?.createdAt}</Moment></td>
            {tr?.endDateTime && !isActive && <td><Moment tz={timeZone?.timeZone} format="DD/MM/YYYY LT">{tr?.endDateTime}</Moment></td>}

            <td>
              <div className="d-flex gap-1">
                {isActive ?
                  <button className="btn btn-warning btn-sm" onClick={() => handelStopTimer(tr?._id)} >
                    Stop / Remove
                  </button> :
                  <button className="btn btn-danger btn-sm" onClick={() => handlerDelete(tr?._id)} >
                    Delete
                  </button>
                }
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  }

  return (
    <div>
      {renderGrid(activeTimerCols, activeTimer, true)}
      {deleteTimer && deleteTimer.length ?
        <React.Fragment>
          <h3>Timer History</h3>
          {renderGrid(deleteTimerCols, deleteTimer, false)}
        </React.Fragment> : ''
      }
    </div>
  );

}
export default DataTable;
