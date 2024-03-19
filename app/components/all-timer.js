"use client";
import React, { useEffect, useState } from "react";
import DataTable from "@/app/components/dataTable";
import AddTimer from "./add-timer";

const cols = ["SR.NO", "Name", "COUNTDOWN TIME", "ACTIVE DURATION", "CREATION DATE", "DELETE DATE", "ACTION"];

const AllTimers = () => {

  const [rows, setRows] = useState([]);
  const [timezones, setTimeZones] = useState([]);
  const [selectedtimeZones, setSelectedtimeZones] = useState({});
  useEffect(() => {
    getAllTimers();
    getAllTimerZones();
  }, []);

  async function getAllTimers() {
    try {
      const res = await fetch("../api", {
        method: "GET"
      });
      if (!res.ok) {
        throw new Error("Error: fetching timer");
      }

      const { timers } = await res.json();
      setRows(timers);
    } catch (error) {
      console.log("Error fetching timer");
    }
  }

  async function getAllTimerZones() {
    try {
      const res = await fetch('../api/timezone', {
        method: "GET"
      });
      if (!res.ok) {
        throw new Error("Error: fetching timer Zone");
      }

      const {timeZone} = await res.json();
      setTimeZones(timeZone);
    } catch (error) {
      console.log("Error fetching timer ZONE");
    }
  }
  
  const onTimeZoneChanges = async (value) => {
    console.log('OnChanges::', value);

    try {
      const res = await fetch('../api/timezone', {
        method: "POST",
        body: JSON.stringify({timeZone: value}),
      });
      if (!res.ok) {
        throw new Error("Error: fetching timer Zone");
      }

      const {timeZone} = await res.json();
      console.log('timeZone::', timeZone);
      setSelectedtimeZones(timeZone);
    } catch (error) {
      console.log("Error fetching timer ZONE");
    }
  }

  return (
    <div>
      <h4 className="mb-2">Manage Timer</h4>
      <hr />
      <div className="d-flex mb-2">
        <AddTimer onTimerAdd={getAllTimers} />
      </div>

      <div className="pt-2">
        <select
        className="timeZone"
          onChange={(e) => onTimeZoneChanges(e.target.value)}
        >
          <option value="">Select TimeZone</option>
          {timezones.map((tZone, i) => (
            <option key={i} value={tZone}>{tZone}</option>
          ))}
        </select>
      </div>
      <DataTable cols={cols} rows={rows} timeZone = {selectedtimeZones}/>
    </div>
  )


};

export default AllTimers;
