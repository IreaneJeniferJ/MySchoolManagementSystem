import React from 'react'
import { BarChart } from '@mui/x-charts/BarChart';
const StudentStatus = () => {
  return (
    <BarChart 
      series={[
        { data: [100,90,100,106,243] },
        { data: [51, 66,78,97,107] },
        
      ]}
      height={290}
      xAxis={[{ data: ['8th', '9th', '10th', '11th','12th'] }]}
    />
  )
}

export default StudentStatus