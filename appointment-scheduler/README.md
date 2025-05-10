# Appointment Scheduler

This project is an appointment scheduling web application built with FastAPI for the backend and React for the frontend. 

## Project Structure

```
appointment-scheduler
├── backend
│   ├── app
│   │   ├── main.py               # Entry point for the FastAPI application
│   │   ├── api
│   │   │   ├── endpoints
│   │   │   │   └── appointments.py # API endpoints for appointment management
│   │   │   └── __init__.py
│   │   ├── core
│   │   │   ├── config.py         # Configuration settings for the application
│   │   │   └── __init__.py
│   │   ├── models
│   │   │   ├── appointment.py     # Appointment model definition
│   │   │   └── __init__.py
│   │   ├── schemas
│   │   │   ├── appointment.py     # Pydantic schemas for appointment validation
│   │   │   └── __init__.py
│   │   ├── services
│   │   │   ├── appointment_service.py # Business logic for managing appointments
│   │   │   └── __init__.py
│   │   └── __init__.py
│   └── requirements.txt           # Backend dependencies
├── frontend
│   ├── public
│   │   └── index.html             # Main HTML file for the frontend
│   ├── src
│   │   ├── components
│   │   │   ├── AppointmentForm.jsx # Component for creating/editing appointments
│   │   │   ├── AppointmentList.jsx # Component for displaying appointments
│   │   │   └── __init__.py
│   │   ├── pages
│   │   │   ├── HomePage.jsx       # Landing page component
│   │   │   └── __init__.py
│   │   ├── App.jsx                # Main application component
│   │   └── index.js               # Entry point for the React application
│   └── package.json               # Frontend dependencies and scripts
└── README.md                      # Project documentation
```

## Features

- Create, read, update, and delete appointments.
- User-friendly interface for managing appointments.
- FastAPI backend for handling API requests.
- React frontend for a responsive user experience.

## Getting Started

### Backend

1. Navigate to the `backend` directory.
2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the FastAPI application:
   ```
   uvicorn app.main:app --reload
   ```

### Frontend

1. Navigate to the `frontend` directory.
2. Install the required dependencies:
   ```
   npm install
   ```
3. Start the React application:
   ```
   npm start
   ```

## License

This project is licensed under the MIT License.