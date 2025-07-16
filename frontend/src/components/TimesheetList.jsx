
import React from 'react';

function TimesheetList({ timesheets }) {
  if (!timesheets.length) {
    return <p>タイムシートの記録がありません。</p>;
  }

  return (
    <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>ユーザーID</th>
          <th>日付</th>
          <th>開始時間</th>
          <th>終了時間</th>
          <th>内容</th>
        </tr>
      </thead>
      <tbody>
        {timesheets.map(({ _id, userId, date, startTime, endTime, description }) => (
          <tr key={_id}>
            <td>{userId}</td>
            <td>{new Date(date).toLocaleDateString()}</td>
            <td>{startTime}</td>
            <td>{endTime}</td>
            <td>{description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TimesheetList;