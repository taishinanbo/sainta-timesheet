import React, { useState } from 'react';
import Attendance from './Attendance.jsx';

function Home() {
  const [timesheets, setTimesheets] = useState([]);

  const addTimesheet = (newSheet) => {
    setTimesheets([...timesheets, newSheet]);
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h1>タイムシート</h1>
      <Attendance />
      {/* <TimesheetForm onAdd={addTimesheet} />
      <TimesheetList timesheets={timesheets} /> */}
    </div>
  );
}

export default Home;