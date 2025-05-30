const express = require('express');
const excel = require('exceljs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const Enquiry = require('./model/Enquiry');
const Admission = require("./model/Admission");
const Manager = require('./model/Manager');
const Employee = require('./model/Employee');
const Fees = require("./model/Fees")
const Course = require("./model/Course");
const CenterCourse = require("./model/centerCourseSchema");
const { FollowUp } = require('./model/FollowUp'); 
const Walkin = require('./model/Walkin')
const ProjectAdmission = require('./model/ProjectAdmission');
const ProjectStatus = require('./model/ProjectStatus');
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');
const franchiseUserRouter = require('./routes/franchiseUserRouter');
const franchiseAccountsRouter = require('./routes/franchiseAccountsRoutes');
const franchiseStoreRouter = require('./routes/franchiseStoreRoutes');
const franchiseRouter = require("./routes/franchiseRoutes");
const { loginCheck } = require('./controllers/franchiseController');

const app = express();

app.use(cors("*"));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2 }, // 2MB file size limit
});

// replace connection

mongoose.connect('mongodb+srv://dataproDev:MongoDB1990@erp.ad9zoqp.mongodb.net/ERP')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));


const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access Denied: No Token Provided');

  jwt.verify(token, "jwt-secret", (err, user) => {
    if (err) return res.status(403).send('Invalid Token');
    req.user = user;
    next();
  });
};

const getRemainders = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const remainders = await FollowUp.aggregate([
      {
        $unwind: "$remarks"
      },
      {
        $match: {
          "remarks.nextFollowUpDate": {
            $gte: today,
            $lte: endOfDay
          }
        }
      },
      {
        $sort: {
          "remarks.followUpDate": -1 
        }
      },
      {
        $group: {
          _id: "$enquiryId",
          studentName: { $first: "$studentName" },
          studentContact: { $first: "$studentContact" },
          courseInquired: { $first: "$courseInquired" },
          lastRemark: { $first: "$remarks" }
        }
      },
      {
        $project: {
          _id: 1,
          studentName: 1,
          studentContact: 1,
          courseInquired: 1,
          lastRemark: {
            followUpDate: 1,
            notes: 1,
            nextFollowUpDate: 1
          }
        }
      }
    ]);

    return remainders;
  } catch (error) {
    console.error('Error fetching remainders:', error.message);
    throw error;
  }
};

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

app.post('/enquiries',authenticateToken, async (req, res) => {
  try {
    const {
      place,
      name,
      address,
      background,
      collegeSchool,
      mobile,
      email,
      dob,
      aadhar,
      coursePreferred,
      timePreferred,
      source,
      courseFee,
      counselorName,
      centerName,
      remarks
    } = req.body;

    if(req.user.center !== centerName){
       return res.status(500).json("Invalid Access");
    }

    const enquiryData = {
      place,
      name,
      address,
      background,
      collegeSchool,
      mobile,
      email,
      dob,
      aadhar,
      coursePreferred,
      timePreferred,
      source,
      courseFee,
      counselorName,
      centerName,
      remarks
    };


    Object.keys(enquiryData).forEach((key) => {
      if (enquiryData[key] === undefined) {
        delete enquiryData[key];
      }
    });

    const newEnquiry = new Enquiry(enquiryData);

    const savedEnquiry = await newEnquiry.save();

    res.status(201).json("Registered Successfully");
  } catch (err) {
    if (err.name === 'ValidationError' || err.code === 11000) {
      console.log(err);
      res.status(400).json({ error: err.message });
    } else {
      console.log(err);
      res.status(500).json("Server Error");
    }
  }
});

app.get('/student-details',authenticateToken,async (req, res) => {
  try {
    const { mobile, aadhar } = req.query;
    console.log()
    if (!mobile && !aadhar) {
      return res.status(400).json({ error: 'Please provide either mobile or aadhar number' });
    }
    const query = mobile ? { mobile } : { aadhar };
    const user = await Enquiry.find(query);
    console.log(user)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const users = user.filter(u => u.centerName === req.user.center)
    res.json(users);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/enquiries',async (req, res) => {
  try {
      const enquiries = await Enquiry.find({});
      res.status(200).json(enquiries);
  } catch (err) {
      res.status(500).json({ message: 'Error fetching enquiries', error: err });
  }
});
app.get('/enquiry/:id',async (req, res) => {
    const {id} = req.params
  try {
      const enquiry = await Enquiry.findById({_id:id});
      console.log(enquiry)
      res.status(200).json(enquiry);
  } catch (err) {
      res.status(500).json({ message: 'Error fetching enquiries', error: err });
  }
});

app.get('/enquiry-status',authenticateToken,async (req, res) => {
  try {
      const Councillor = req.user.name
      const enquiries = await Enquiry.find({});
      const en = enquiries.filter(u => u.counselorName.toLowerCase() === Councillor.toLowerCase());
      res.status(200).json(en);
  } catch (err) {
      res.status(500).json({ message: 'Error fetching enquiries', error: err });
  }
});

app.delete("/delete-enquiry/:id",authenticateToken,async(req,res) =>{
  const {id} = req.params;
  try{
    const deleteEnquiry = await Enquiry.findByIdAndDelete(id);
    res.status(201).json("Enquiry Deleted")
  }catch(e){
    res.status(500).json("Server Error")
  }
})

app.post('/register-manager', async (req, res) => {
  const { name, password, center } = req.body;
 
  if (!name || !password || !center) {
    return res.status(400).json({ error: 'Name, password, and center are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);
    
    const newManager = new Manager({
      name,
      password: hashedPassword,
      center
    });

    await newManager.save();
    console.log('Manager saved successfully:', newManager);

    res.status(201).json({ message: 'Manager registered successfully' });
  } catch (error) {
    console.error('Error in /register-manager:', error);
    res.status(500).json({ error: 'Failed to register. Please try again.' });
  }
});

app.post('/manager-login', async (req, res) => {
  const { username, password,center } = req.body;
  try {
    const manager = await Manager.findOne({ name:username});
    if (!manager) {
      return res.status(401).json({ error: 'Invalid name or password' });
    }
    const isMatch = await bcrypt.compare(password, manager.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid name or password' });
    }
    if(manager.center !== center){
      return res.status(401).json({ error: 'Invalid center' });
    }

    const token = jwt.sign({ id: manager._id, center: manager.center }, "jwt-secret", { expiresIn: '1h' });

    res.status(200).json({ token, center: manager.center });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login. Please try again.' });
  }
});

app.get('/getDetails',authenticateToken,async (req, res) => {
  const { mobile } = req.query;
  if (!mobile) {
    return res.status(400).json('Mobile number is required');
  }

  try {
    const enquiries = await Enquiry.find({ mobile });
    const filteredEnquiries = enquiries.filter(e => e.centerName === req.user.center  && e.counselorName.toLowerCase() === req.user.name.toLowerCase());
    if (filteredEnquiries.length === 0) {
      return res.status(400).json('No data found for the provided mobile number');
    }

    res.json(filteredEnquiries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/getDetails/:id', async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ message: 'Admission not found' });
    }
    res.json(admission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/admissions',authenticateToken,upload.single('image'), async (req, res) => {
  try {
    const {
      IdNo, centerName, name, gender, address, aadhar,
      mobile, email, others, courseEnrolled,
      totalFees, durationOfCourse, feeDueDate, trainer, timings,remarks,enrolledId
    } = req.body;
    const newAdmissionData = {
      IdNo,
      centerName,
      name,
      gender,
      address,
      aadhar,
      mobile,
      email,
      others,
      courseEnrolled,
      totalFees,
      durationOfCourse,
      feeDueDate,
      trainer,
      counselorName :req.user.name,
      remarks,
      timings
    };

    if (req.file) {
      const imagePath = req.file.path.replace(/\\/g, '/').replace('uploads/', '');
      newAdmissionData.image = imagePath;
    }

    const newAdmission = new Admission(newAdmissionData);
    const savedAdmission = await newAdmission.save();

    if (enrolledId !== null) {
      await Enquiry.findByIdAndUpdate(enrolledId, { status: 'joined' });
    }

    res.status(201).json(savedAdmission);
  } catch (error) {
    console.error('Error creating admission entry:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/admissions', async (req, res) => {
  try {
      const admission = await Admission.find({});
      res.status(200).json(admission);
  } catch (err) {
      res.status(500).json({ message: 'Error fetching enquiries', error: err });
  }
});

app.post('/register-employee', authenticateToken,async (req, res) => {
  const { username, password, role } = req.body;

  try {

    const center = req.user.center;
      const existingEmployee = await Employee.findOne({ username:username,center:center });

      if (existingEmployee) {
          return res.status(400).send('Username already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const newEmployee = new Employee({
          username,
          password: hashedPassword,
          role,
          center
      });

      await newEmployee.save();
      res.status(201).send('Employee registered successfully');
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

app.post('/login-employee', async (req, res) => {
  const { username, password, center, role } = req.body;
  try {
      const user = await Employee.findOne({ username });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid password' });
      }

      if (user.center !== center || user.role !== role) {
          return res.status(401).json({ message: 'Invalid center or role' });
      }

      const token = jwt.sign({ id: user._id, center: user.center, name:user.username, role: user.role }, "jwt-secret", { expiresIn: '1h' });

      res.status(200).json({ token });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

app.delete("/delete-employees/:id",async(req, res) => {
  const {id} = req.params
  try{
    const d = await Employee.findByIdAndDelete({ _id:id });
    res.status(201).json("Deleted Successful")
  }catch(e){
    res.status(500).json("Failed To Delete")
    console.log(e)
  }
})

app.get("/employees",async(req, res) => {
  try{
    const employees = await Employee.find({})
    res.status(200).json({ employees });
  }catch(e){
    res.status(501).json({ "message": e });
  }
})

app.get("/student/:id",async(req,res) => {
  const {id} = req.params
  try{
    const admission = await Admission.findOne({ IdNo:id })
    const feesDetails = await Fees.findOne({ IdNo:id })
    if(!admission){
      return res.status(501).json("student not found")
    }
    res.status(200).json({ admission,feesDetails });
  }catch(e){
    res.status(500).send(e)
  }
})

app.post('/pay-fees', async (req, res) => {
  const { IdNo, receiptNumber, amountPaid, modeOfPayment, nextTermDate, center } = req.body;
  if (!IdNo || !amountPaid || !modeOfPayment || !nextTermDate || !center) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const admission = await Admission.findOne({ IdNo });

    if (!admission) {
      return res.status(400).json({ error: 'Student admission record not found' });
    }

    let fees = await Fees.findOne({ IdNo });

    if (fees) {
      const lastTermNumber = fees.terms.length > 0 
        ? Math.max(...fees.terms.map(term => term.termNumber)) 
        : 0;
      const newTermNumber = lastTermNumber + 1;

      fees.terms.push({ receiptNumber,termNumber: newTermNumber, amountPaid, modeOfPayment });
      fees.nextTermDate = nextTermDate;
      const totalPaid = fees.terms.reduce((total, term) => total + term.amountPaid, 0);

      fees.totalStatus = totalPaid >= admission.totalFees ? 'completed' : 'pending';
      await fees.save();
    } else {
      const totalPaid = amountPaid;
      const totalStatus = totalPaid >= admission.totalFees ? 'completed' : 'pending';

      fees = new Fees({
        IdNo,
        terms: [{receiptNumber, termNumber: 1, amountPaid, modeOfPayment }],
        nextTermDate,
        totalStatus,
        center
      });
      await fees.save();
    }

    res.status(200).json({ message: 'Term added successfully', fees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/get-fees-details/:id",async(req, res) => {
    const {id} = req.params;
    try{
      const feesDetails = await Fees.findOne({IdNo:id});
      if(!feesDetails){
        res.status(200).json("No Payment Details Found")
      }
      res.status(200).json(feesDetails)
    }catch(e){
      res.status(500).json(e.message)
    }
})

app.get('/fees-due-today', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // Increment the date by one day

  try {
    const feesDueToday = await Fees.find({
      nextTermDate: {
        $gte: today,
        $lt: tomorrow
      },
      totalStatus: 'pending'
    });

    const feesWithAdmissions = await Promise.all(feesDueToday.map(async (fee) => {
      const admission = await Admission.findOne({ IdNo: fee.IdNo });
      return {
        fee,
        admission
      };
    }));

    res.status(200).json(feesWithAdmissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/fees",async(req, res) => {
  try{
    const feesDetails = await Fees.find();
    if(!feesDetails){
      res.status(200).json("No Payment Details Found")
    }
    res.status(200).json(feesDetails)
  }catch(e){
    res.status(500).json(e.message)
  }
})

app.post('/add-course', upload.single('courseImage'), async (req, res) => {
  try {
    const { courseName, courseFees, courseDuration, category } = req.body;
    const existingCourse = await Course.findOne({ courseName });
    if (existingCourse) {
      return res.status(409).json({ error: 'Course already exists' });
    }
    const newCourse = new Course({
      courseName,
      courseFees,
      courseDuration,
      category
    });

    if (req.file) {
      const imagePath = req.file.path.replace(/\\/g, '/').replace('uploads/', '');
      newCourse.image = imagePath;
    }

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add course' });
  }
});

app.get('/get-courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.post('/add-center-course', async (req, res) => {
  try {
    const { courseId, centerName, centerFees } = req.body;

    let centerCourse = await CenterCourse.findOne({ centerName });

    if (centerCourse) {
      const courseExists = centerCourse.courses.some(
        course => course.course.toString() === courseId
      );

      if (courseExists) {
        return res.status(409).json({ error: 'Course already exists for this center' });
      }

      centerCourse.courses.push({ course: courseId, centerFees });
    } else {
      centerCourse = new CenterCourse({
        centerName,
        courses: [{ course: courseId, centerFees }]
      });
    }

    await centerCourse.save();
    res.status(201).json(centerCourse);
  } catch (error) {
    console.error('Error adding center course:', error);
    res.status(500).json({ error: 'Failed to add center course' });
  }
});

app.get('/get-center-courses', async (req, res) => {
  try {
    const { center } = req.query;
    if (!center) {
      return res.status(400).json({ error: 'Center is required' });
    }

    const centerCourses = await CenterCourse.findOne({ centerName: center })
      .populate({
        path: 'courses.course',
        select: 'courseName courseFees courseDuration image category'
      })
      .exec();

    if (!centerCourses) {
      return res.status(404).json({ error: 'No courses found for this center' });
    }

    const courses = centerCourses.courses.map(courseItem => ({
      courseId: courseItem.course._id,
      centerFees: courseItem.centerFees,
      courseName: courseItem.course.courseName,
      courseFees: courseItem.course.courseFees,
      courseDuration: courseItem.course.courseDuration,
      image: courseItem.course.image,
      category: courseItem.course.category
    }));

    res.status(200).json({ courses });
  } catch (error) {
    console.error('Error fetching center courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/get-all-center-courses', async (req, res) => {
  try {
    const centerCourses = await CenterCourse.find({})
      .populate({
        path: 'courses.course',
        select: 'courseName courseFees courseDuration image category'
      })
      .exec();

    if (!centerCourses.length) {
      return res.status(404).json({ error: 'No courses found for any center' });
    }

    const formattedData = centerCourses.map(centerCourse => ({
      centerName: centerCourse.centerName,
      courses: centerCourse.courses.map(courseItem => ({
        courseId: courseItem.course._id,
        centerFees: courseItem.centerFees,
        courseName: courseItem.course.courseName,
        courseFees: courseItem.course.courseFees,
        courseDuration: courseItem.course.courseDuration,
        image: courseItem.course.image,
        category: courseItem.course.category
      }))
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching center courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/delete-center-course', async (req, res) => {
  const { centerName, courseId } = req.body;
  console.log(req.body)

  try {
    const centerCourse = await CenterCourse.findOne({ centerName });
    if (!centerCourse) {
      return res.status(404).json({ error: 'Center not found' });
    }

    const courseIndex = centerCourse.courses.findIndex(course => course.course.toString() === courseId);
    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    centerCourse.courses.splice(courseIndex, 1);
    await centerCourse.save();

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/add-follow-up', async (req, res) => {
  try {
    const { enquiryId, studentName, studentContact, courseInquired, notes, nextFollowUpDate } = req.body;

    if (!enquiryId || !notes || !nextFollowUpDate || !studentName || !studentContact || !courseInquired) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const followUpDate = new Date();

    let followUp = await FollowUp.findOne({ enquiryId });
    if (followUp) {
      if (followUp.remarks.length > 0) {
        followUp.remarks[followUp.remarks.length - 1].remainderStatus = 'completed';
      }

      const remark = {
        followUpDate,
        notes,
        nextFollowUpDate,
        remainderStatus: 'pending'
      };
      followUp.remarks.push(remark);

      followUp.status = 'active';

      await followUp.save();

      res.status(200).json({ message: 'Remark added successfully', followUp });
    } else {
      followUp = new FollowUp({
        enquiryId,
        studentName,
        studentContact,
        courseInquired,
        remarks: [{
          followUpDate,
          notes,
          nextFollowUpDate,
          remainderStatus: 'pending'
        }],
        status: 'active'
      });
      await followUp.save();

      res.status(201).json({ message: 'New enquiry created with remark', followUp });
    }
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/followup-remainders', async (req, res) => {
  try {
    const remainders = await getRemainders();
    res.status(200).json(remainders);
  } catch (error) {
    console.error('Error in /remainders endpoint:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get("/all-remainders", async (req, res) => {
  try {
    const data = await FollowUp.find();
    const latestRemarks = data.map(followUp => {
      let latestRemark = null;

      if (followUp.remarks && followUp.remarks.length > 0) {
        followUp.remarks.sort((a, b) => b.followUpDate - a.followUpDate);
        latestRemark = followUp.remarks[0];
      }

      return {
        _id: followUp._id,
        enquiryId: followUp.enquiryId,
        studentName: followUp.studentName,
        studentContact: followUp.studentContact,
        courseInquired: followUp.courseInquired,
        latestRemark: latestRemark
      };
    });

    res.status(201).json({ data: latestRemarks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/walkins', async (req, res) => {
  try {
    const walkin = new Walkin(req.body);
    await walkin.save();
    res.status(201).send(walkin);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/walkins', async (req, res) => {
  try {
    const walkins = await Walkin.find();
    res.status(200).json(walkins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching walkin data' });
  }
});

app.post('/project-admissions', async (req, res) => {
  try {
    const {
      projectId,
      projectName,
      projectCategory,
      studentName1,
      studentName2,
      phoneNumber1,
      phoneNumber2,
      totalFees,
      feesPaid,
      guide1,
      guide2,
      deadline,
      status,
      councillor,
      remarks,
      walkIn
    } = req.body;
    const newProjectAdmission = new ProjectAdmission({
      projectId,
      projectName,
      projectCategory,
      studentName1,
      studentName2,
      phoneNumber1,
      phoneNumber2,
      totalFees,
      feesPaid,
      guide1,
      guide2,
      deadline,
      status,
      councillor,
      remarks,
    });

    const savedProjectAdmission = await newProjectAdmission.save();
    await Walkin.findByIdAndUpdate(walkIn, { status: 'joined' });
    res.status(201).json(savedProjectAdmission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/project-admissions', async (req, res) => {
  try {
    const admissions = await ProjectAdmission.find();
    res.status(200).json(admissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.put('/project-status', async (req, res) => {
  const {
    projectId,
    completedPercentage,
    supportRequired,
    anyProblems,
    estimatedDateToComplete,
    date,
    dockerPullLink,
    dockerRunCommand,
    githubLink,
    documentationLink
  } = req.body;

  console.log('Received data:', req.body);

  if (
    !projectId ||
    typeof projectId !== 'string' ||
    isNaN(Number(completedPercentage)) ||
    !supportRequired ||
    !anyProblems ||
    !estimatedDateToComplete ||
    !date
  ) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    // Create status object with all fields
    const status = {
      completedPercentage: Number(completedPercentage),
      supportRequired: supportRequired.trim(),
      anyProblems: anyProblems.trim(),
      estimatedDateToComplete: new Date(estimatedDateToComplete),
      date: new Date(date),
      dockerPullLink: dockerPullLink?.trim() || '',
      dockerRunCommand: dockerRunCommand?.trim() || '',
      githubLink: githubLink?.trim() || '',
      documentationLink: documentationLink?.trim() || ''
    };

    console.log('Formatted status object:', status);

    // Find existing project or create new one
    let project = await ProjectStatus.findOne({ projectId });

    if (project) {
      // Add new status to existing project
      project.statusList.push(status);
      const savedProject = await project.save();
      console.log('Updated existing project:', savedProject);
      
      if (!savedProject) {
        throw new Error('Failed to save project');
      }
    } else {
      // Create new project with status
      project = new ProjectStatus({
        projectId,
        statusList: [status]
      });
      const savedProject = await project.save();
      console.log('Created new project:', savedProject);
      
      if (!savedProject) {
        throw new Error('Failed to create new project');
      }
    }

    // Verify the data was saved by fetching it again
    const updatedProject = await ProjectStatus.findOne({ projectId });
    console.log('Final project state:', updatedProject);

    if (!updatedProject) {
      throw new Error('Failed to verify saved data');
    }

    // Verify the latest status contains all fields
    const latestStatus = updatedProject.statusList[updatedProject.statusList.length - 1];
    console.log('Latest status:', latestStatus);

    if (!latestStatus || !latestStatus.completedPercentage || !latestStatus.supportRequired) {
      throw new Error('Status data is incomplete');
    }

    res.status(200).json({ 
      message: 'Status added successfully', 
      project: updatedProject,
      latestStatus
    });
  } catch (error) {
    console.error('Error saving project status:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    if (error.name === 'MongoError') {
      return res.status(500).json({ error: 'Database error: ' + error.message });
    }
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});


app.get("/project-status/:id",async(req, res) => {
  const {id}  = req.params;
  try{
    const project = await ProjectStatus.findOne({projectId:id})
    const status = project.statusList
    res.status(201).json({status})
  }catch(e){
    res.status(500).json({e})
  }
})  

app.get('/fees-today',authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const todayEnd = new Date(today.setHours(23, 59, 59, 999));
    const center = req.user.center

    const fees = await Fees.find({
      'terms.datePaid': { $gte: todayStart, $lte: todayEnd }
    });

    const studentIds = fees.map(fee => fee.IdNo);
    const admissions = await Admission.find({ IdNo: { $in: studentIds },centerName:center});

    const data = admissions.map(admission => {
      const feeRecord = fees.find(fee => fee.IdNo === admission.IdNo);
      const totalPaidFees = feeRecord.terms.reduce((sum, term) => sum + term.amountPaid, 0);
      const remainingFees = admission.totalFees - totalPaidFees;
      const nextTermDate = feeRecord.nextTermDate;

      return {
        IdNo: admission.IdNo,
        name: admission.name,
        gender: admission.gender,
        address: admission.address,
        aadhar: admission.aadhar,
        mobile: admission.mobile,
        email: admission.email,
        courseEnrolled: admission.courseEnrolled,
        dateOfJoining: formatDate(admission.dateOfJoining),
        totalFees: admission.totalFees,
        durationOfCourse: admission.durationOfCourse,
        timings: admission.timings,
        totalPaidFees,
        remainingFees,
        nextTermDate: formatDate(nextTermDate),
      };
    });

    res.json(data);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

const expectedNumberOfFields = 10;

app.post('/upload', upload.single('file'), async (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.file.filename);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return res.status(400).send('File not found');
  }

  const results = []; // Array to store valid data rows

  try {
    // Read and parse the CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          // Validate field count
          if (Object.keys(data).length < expectedNumberOfFields) {
            console.warn('Invalid CSV row, missing fields:', data);
            return; // Skip malformed rows
          }
          results.push(data);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    console.log('CSV Data:', results); // Debugging log for data

    // Process each row
    for (const row of results) {
      try {
        // Parse and validate DOB
        const dobRaw = row.dob ? row.dob.trim() : null; // Ensure no leading/trailing whitespace
        const dobFormats = ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY', 'M/D/YYYY'];
        const dobMoment = moment(dobRaw, dobFormats, true);

        if (!dobMoment.isValid()) {
          console.warn(`Invalid dob for row: ${JSON.stringify(row)}. dob value: ${dobRaw}`);
          continue; // Skip this row if DOB is invalid
        }

        const dob = dobMoment.toDate(); // Convert to JavaScript Date object

        // Build enquiry data
        const enquiryData = {
          place: row.place,
          name: row.name,
          address: row.address,
          background: row.background,
          collegeSchool: row.collegeSchool,
          mobile: row.mobile,
          email: row.email,
          dob: dob, // Use validated date
          aadhar: row.aadhar || null,
          coursePreferred: row.coursePreferred,
          timePreferred: row.timePreferred,
          source: row.source,
          courseFee: row.courseFee || null,
          counselorName: row.counselorName,
          centerName: row.centerName,
          status: row.status || 'notJoined',
          remarks: row.remarks || null,
        };

        // Validate required fields
        const requiredFields = ['place', 'background', 'coursePreferred', 'timePreferred', 'source'];
        const missingFields = requiredFields.filter((field) => !enquiryData[field]);

        if (missingFields.length > 0) {
          console.warn(`Missing required fields in row: ${JSON.stringify(row)}. Missing: ${missingFields.join(', ')}`);
          continue; // Skip rows with missing required fields
        }

        // Save to the database
        const newEnquiry = new Enquiry(enquiryData);
        await newEnquiry.save();
      } catch (error) {
        console.error(`Error processing row: ${JSON.stringify(row)}`, error);
      }
    }

    res.status(200).json({ message: 'Data uploaded and saved successfully' });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).send('Error processing file');
  } finally {
    // Clean up the uploaded file
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting uploaded file:', err);
    });
  }
});

app.get('/download-fees-today',authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const todayEnd = new Date(today.setHours(23, 59, 59, 999));
    const center = req.user.center;

    const fees = await Fees.find({
      'terms.datePaid': { $gte: todayStart, $lte: todayEnd }
    });
    const studentIds = fees.map(fee => fee.IdNo);
    const admissions = await Admission.find({ IdNo: { $in: studentIds },centerName:center});

    const data = admissions.map(admission => {
      const feeRecord = fees.find(fee => fee.IdNo === admission.IdNo);
      const totalPaidFees = feeRecord.terms.reduce((sum, term) => sum + term.amountPaid, 0);
      const remainingFees = admission.totalFees - totalPaidFees;
      const nextTermDate = feeRecord.nextTermDate;
      const today1 = new Date().toISOString().split('T')[0];
      const filteredPayments = feeRecord.terms.filter(payment => {
        const paymentDate = payment.datePaid.toISOString().split('T')[0];
        return paymentDate === today1;
      });
      const receiptNumber = filteredPayments[0].receiptNumber;
      const amountPaid = filteredPayments[0].amountPaid
      console.log(filteredPayments);

      return {
        IdNo: admission.IdNo,
        receiptNumber,
        amountPaid,
        name: admission.name,
        gender: admission.gender,
        address: admission.address,
        aadhar: admission.aadhar,
        mobile: admission.mobile,
        email: admission.email,
        courseEnrolled: admission.courseEnrolled,
        dateOfJoining: formatDate(admission.dateOfJoining),
        totalFees: admission.totalFees,
        durationOfCourse: admission.durationOfCourse,
        timings: admission.timings,
        totalPaidFees,
        remainingFees,
        nextTermDate: formatDate(nextTermDate),
      };
    });

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Fees Today');

    worksheet.columns = [
      { header: 'ID No', key: 'IdNo', width: 15 },
      { header: 'Receipt No', key: 'receiptNumber', width: 15 },
      { header: 'Amount Paid', key: 'amountPaid', width: 15 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'Address', key: 'address', width: 25 },
      { header: 'Aadhar', key: 'aadhar', width: 20 },
      { header: 'Mobile', key: 'mobile', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Course Enrolled', key: 'courseEnrolled', width: 20 },
      { header: 'Date of Joining', key: 'dateOfJoining', width: 15 },
      { header: 'Total Fees', key: 'totalFees', width: 10 },
      { header: 'Duration of Course', key: 'durationOfCourse', width: 15 },
      { header: 'Timings', key: 'timings', width: 15 },
      { header: 'Total Paid Fees', key: 'totalPaidFees', width: 15 },
      { header: 'Remaining Fees', key: 'remainingFees', width: 15 },
      { header: 'Next Term Date', key: 'nextTermDate', width: 15 },
    ];

    worksheet.addRows(data);

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'fees-today.xlsx'
    );

    res.send(buffer);
    console.log("hello");
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


app.use("/franchises", express.static("Franchise"));
app.use("/franchise/admin", franchiseRouter);
app.use("/franchise/user", franchiseUserRouter);
app.use("/franchise/accounts", franchiseAccountsRouter);
app.use("/franchise/store", franchiseStoreRouter);
app.use("/franchise/login", loginCheck);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
