## HHM API tracker

Legend
- [x] done
- [ ] pending

### Auth
- [x] POST `/auth/patients/register`
- [x] POST `/auth/otp/verify`
- [x] POST `/auth/otp/resend`
- [x] POST `/auth/login/email`
- [x] POST `/auth/login/phone`
- [x] POST `/auth/password/reset/request`
- [x] POST `/auth/password/reset/verify`
- [x] POST `/auth/password/reset/confirm`

### Patients
- [x] POST `/patients/profile/setup` (JWT)
- [x] GET `/patients/profile` (JWT)
- [x] GET `/patients/dashboard` (JWT)

### Insurance / coverage
- [x] POST `/insurance/verify`

### Triage
- [x] POST `/triage/compute`
- [x] GET `/triage/history`
- [x] POST `/triage/wishlist`

### Appointments
- [x] GET `/appointments` (JWT)
- [x] POST `/appointments` (JWT)
- [x] DELETE `/appointments/:id` (JWT)
- [x] POST `/appointments/:id/reschedule` (JWT)
- [x] GET `/doctors/:id/schedule` (JWT, demo schedule)
- [x] POST `/appointments/:id/soap` (JWT, doctor)
- [x] POST `/appointments/:id/review` (JWT, patient)

### Notifications
- [x] GET `/notifications` (JWT)
- [x] POST `/notifications/:id/read` (JWT)

### Doctor
- [x] GET `/doctor/dashboard` (stub)
- [x] GET `/doctors` (JWT, list + filters)
- [x] GET `/doctors/:id` (JWT, doctor profile)
- [x] GET `/doctors/:id/reviews` (JWT)
- [x] GET `/doctor/patients` (JWT, doctor)
- [x] GET `/doctor/patients/:patientId` (JWT, doctor)

### Donor (deferred)
- [ ] GET `/donor/dashboard`
- [ ] POST `/donor/donations`
