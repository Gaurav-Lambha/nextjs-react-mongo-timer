"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

const AddTimer = ({onTimerAdd}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const minDate = new Date();
  const [timerValue, onTimerChange] = useState(new Date());
  const onSubmit = async (data) => {
    try {
      const payLoad = { ...data, ...{ startDateTime: timerValue } };
      const res = await fetch("../api", {
        method: "POST",
        body: JSON.stringify(payLoad),
      });

      if (!res.ok) {
        throw new Error("Failed to add timer");
      }

      const { message } = await res.json();
      onTimerAdd();
      alert(message);
    } catch (error) {
      console.log("Failed to add timer", error);
      alert("Failed to add timer");
    }
  };

  return (
    <div>      
      <div className="mb-2">
        <form onSubmit={handleSubmit(onSubmit)} method="POST">
          <div className="row">
            <div className="col-5">
              <label htmlFor="timerName" className="form-label">
                Timer Name
              </label>
              <input
                placeholder="Please enter timer name"
                className="form-control"
                {...register("timerName", { required: true })}
              />
            </div>
            <div className="col-3">
              <label className="form-label">
                Select time
              </label>
              <DateTimePicker minDate={minDate} onChange={onTimerChange} value={timerValue} />
            </div>
            <div className="col-4 mt-4 pt-2 ml-4 text-end">
              <input type="submit" className="btn btn-primary" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTimer;
