# EdTech Learning Task Manager

## Project Overview
EdTech Learning Task Manager is a full-stack application built with **React** (frontend) and **Node.js + Express** (backend).  
It allows teachers to assign tasks to students and lets students view, manage, and complete their tasks.  
The project demonstrates **role-based access**, proper error handling, and clean architecture.

---

## Features

### Teacher
- View all tasks created in the system
- Create new tasks and assign them to students
- Mark tasks as completed
- Delete tasks
- **Teacher Task-View Logic:** Teachers can see all tasks, filter by student, and update the status of tasks. Only teachers have full access to all tasks.

### Student
- View tasks assigned specifically to them
- Mark tasks as completed
- Track task status

### General
- User authentication and role-based authorization
- Clean folder structure for client and server
- Error handling implemented on backend routes

---

## Setup Instructions

 <!-- <!-- 1. Clone the Repository
```bash
# git clone https://github.com/yourusername/EdTech-Learning-Task-Manager.git
# cd EdTech-Learning-Task-Manager -->

# # Role Functionality## 

# # Teacher:## -->

Can view all tasks in the system
Assign tasks to any student
Update task status (complete/incomplete)
Delete tasks
Task-view logic: Teachers can filter tasks by student, status, or date to manage assignments efficiently.

## Student:##
Can only see tasks assigned to them
Can mark tasks as complete
Cannot edit or delete tasks
Cannot view other students’ tasks

---------
##### AI Assistance Disclosure

AI helped with:
Generating React component structure
Creating form validation logic
Structuring README and setup instructions
---------
##I implemented or fixed:

Authentication and JWT-based authorization
Teacher task-view logic
Role-based access control
Error handling and API responses

## Known Issues ##

Some UI components may not be fully responsive on mobile devices
Email notifications for tasks are not implemented
Real-time task status updates are not available
## Suggestions for Improvement

Implement real-time updates with WebSockets
Enhance UI styling using Tailwind CSS or Material-UI
Add task deadlines and notifications for students
Include search and filter functionality for tasks
