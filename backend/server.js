const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

require('dotenv').config()

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true 
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const studentRoutes=require('./routes/student.js');
const staffRoutes=require('./routes/staff.js');
const standardRoutes=require('./routes/standard.js');
const staffRoleRoutes=require('./routes/staffRole.js');
const eventLabelRoutes = require('./routes/eventLabel.js');
const eventRoutes = require('./routes/event.js');
const dashboardRoutes = require('./routes/dashboard');

app.use('/student',studentRoutes);
app.use('/staff/',staffRoutes);
app.use('/standard',standardRoutes);
app.use('/staffRole',staffRoleRoutes);
app.use('/eventLabel', eventLabelRoutes);
app.use('/events', eventRoutes);
app.use('/api/dashboard', dashboardRoutes);

mongoose.connect(process.env.MONGO_URI).then(()=>console.log("DB connected")).catch((e)=>console.log('DB failed to connect'+e));
app.listen(process.env.PORT,()=>console.log('Server running on http://localhost:'+process.env.PORT));
