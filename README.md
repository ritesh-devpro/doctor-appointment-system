# DrConnect

Full-stack Doctor Appointment Booking System built with the MERN stack and Tailwind CSS.

## Features

- JWT authentication for `admin`, `doctor`, and `patient`
- Patient self-signup and appointment management
- Admin-only doctor onboarding with image upload
- Doctor dashboard with earnings, availability toggle, and profile management
- Doctor appointment actions for completing or cancelling visits
- Patient profile management for contact, gender, DOB, and address details
- MongoDB-backed slot storage so booked time slots are blocked in the database
- Demo doctors with future appointment slots are created automatically when the database is empty
- React Context API state management and React Router role-based navigation

## Project Structure

```text
Drconnect/
  backend/
  frontend/
```

## Backend Setup

1. Copy `backend/.env.example` to `backend/.env`
2. Fill in MongoDB and JWT values
3. Install dependencies:

```bash
cd backend
npm install
```

4. Start the API:

```bash
npm run dev
```

The backend automatically creates a default admin from the environment values if one does not already exist.

## Frontend Setup

1. Copy `frontend/.env.example` to `frontend/.env`
2. Install dependencies:

```bash
cd frontend
npm install
```

3. Start the client:

```bash
npm run dev
```

## Default Flow

- Admin logs in and adds doctors with image, specialty, degree, address, and slot list
- Patients sign up and browse doctors by specialty
- Patients open a doctor booking page, choose an available slot, and book it
- Patients manage payment and cancellation from `My Appointments`
- Doctors monitor their dashboard and update availability/profile details
- Demo doctor login: `ananya@drconnect.com` / `Doctor@123`

## Example Slot Format

When adding a doctor from the admin panel, paste one ISO date-time per line:

```text
2026-04-10T10:00:00.000Z
2026-04-10T11:30:00.000Z
2026-04-11T09:00:00.000Z
```
