import React, { useState, useEffect } from 'react';
// import TimesheetForm from '../components/TimesheetForm.jsx';
// import TimesheetList from '../components/TimesheetList.jsx';
import Attendance from "./Attendance.jsx"

function Home() {
  const [timesheets, setTimesheets] = useState([]);

  // ここでバックエンドからデータ取得（例）
  useEffect(() => {
    fetch('/api/timesheets')
      .then(res => res.json())
      .then(data => setTimesheets(data))
      .catch(console.error);
  }, []);

  // 新規作成時のstate更新
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