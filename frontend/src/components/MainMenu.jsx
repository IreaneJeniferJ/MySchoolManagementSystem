
import { AppBar, CssBaseline, Toolbar } from "@mui/material";
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import Toy from "../assets/toy.png";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
 
import React,{useState} from 'react'
import {Routes,Route} from 'react-router-dom';
import {Link } from 'react-router-dom';
import Dashboard from '../pages/Dashboard.jsx';
import Students from '../pages/Student.jsx';
import Teachers from '../pages/Teachers.jsx';
import EventCalendar from '../pages/EventCalendar.jsx';
import AddStudent from '../pages/AddStudent.jsx';
import AddTeacher from '../pages/AddTeacher.jsx';
import StudentStandard from "../pages/StudentStandard.jsx";
import StaffRole from "../pages/StaffRole.jsx";
import EventLabel from "../pages/EventLabel.jsx";
import StudentProfile from './StudentProfile';

const MainMenu = () => {

const [open, setOpen] = useState(0);
 
  const handleOpen = (value) => setOpen(open === value ? 0 : value);
 

  return (
    <>
      <CssBaseline/>
      <AppBar position="relative">
        <Toolbar className='flex justify-end'>
          <div className='w-32 flex gap-2'>
          <NotificationAddIcon/>
          <img src={Toy} width={20} height={20} className="rounded-full" />
          </div>
        </Toolbar>
      </AppBar>
      <section className='flex gap-5 p-8'>
      <aside className='w-80 flex-col h-screen border-b-gray-500 border-solid'>
        <nav>
          <ul>
            <li><Link to="/" className="w-full hover:bg-gray-100 cursor-pointer rounded-sm">Dashboard</Link></li>
            <li><Link to="/students" className="w-full hover:bg-gray-100 cursor-pointer rounded-sm">Students</Link></li>
            <li><Link to="/teachers" className="w-full hover:bg-gray-100 cursor-pointer rounded-sm">Teachers</Link></li>
            <li><Link to="/eventManager" className="w-full hover:bg-gray-100 cursor-pointer rounded-sm">Event</Link></li>
            
            <li>
  <button
    onClick={() => handleOpen(1)}
    className="w-full text-left hover:bg-gray-100 cursor-pointer rounded-sm focus:bg-blue-400"
  >
    Master
  </button>
  {open === 1 && (
    <ul className="pl-8 py-2 space-y-2 text-sm">
      <li>
        <Link to="/studentStandard" className="hover:bg-gray-100 cursor-pointer rounded-sm focus:bg-blue-400">Student standard</Link>
      </li>
      <li>
        <Link to="/staffRole" className="hover:bg-gray-100 cursor-pointer rounded-sm focus:bg-blue-400">Staff Role</Link>
      </li>
      <li>
        <Link to="/eventLabel" className="hover:bg-gray-100 cursor-pointer rounded-sm focus:bg-blue-400">Event Label</Link>
      </li>
    </ul>
  )}
</li>
          
          </ul>
        </nav>
      </aside>
      <main className='w-full border-b-gray-500 border-solid'>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/students" element={<Students/>} />
        <Route path="/teachers" element={<Teachers/>} />
        <Route path="/eventManager" element={<EventCalendar/>} />
        <Route path="/AddStudent" element={<AddStudent/>}/>
        <Route path="/AddTeacher" element={<AddTeacher/>}/>
        <Route path="/studentStandard" element={<StudentStandard/>}/>
        <Route path="/staffRole" element={<StaffRole/>}/>
        <Route path="/eventLabel" element={<EventLabel/>}/>
        <Route path="/student/:id" element={<StudentProfile />} />
      </Routes>
      </main>
      </section>
    </>
  )
}

export default MainMenu