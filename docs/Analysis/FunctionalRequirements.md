# PingMe2 – Functional Requirements

## 1. User Authentication

FR-01. The system shall allow users to register using an email and password.

FR-02. The system shall allow users to log in using valid credentials.

FR-03. The system shall allow users to log out, clearing all session-related data.

FR-04. The system shall maintain the authenticated state across app restarts.

---

## 2. User Profile Management

FR-05. The system shall associate all data (categories, lists, reminders) with a single authenticated user.

FR-06. The system shall prevent users from accessing data belonging to other users.

---

## 3. Category Management

FR-07. The system shall allow users to create custom categories.

FR-08. The system shall allow users to edit existing categories.

FR-09. The system shall allow users to delete categories.

FR-10. The system shall always provide a default category (e.g., "All") that cannot be deleted.

FR-11. The system shall allow one active category to be selected at a time.

FR-12. The system shall filter reminders based on the currently active category.

---

## 4. List Management

FR-13. The system shall allow users to create lists.

FR-14. The system shall allow users to edit list details (name, description, color).

FR-15. The system shall allow users to delete lists.

FR-16. The system shall display all reminders associated with a selected list.

FR-17. The system shall allow reminders to belong to zero or one list.

---

## 5. Reminder Management

FR-18. The system shall allow users to create reminders.

FR-19. The system shall allow users to edit reminder details (title, description, date, time, priority, location, images).

FR-20. The system shall allow users to delete reminders.

FR-21. The system shall allow users to mark reminders as completed or not completed.

FR-22. The system shall allow reminders to be assigned to exactly one category.

FR-23. The system shall allow reminders to be optionally assigned to one list.

---

## 6. Reminder Filtering and Organization

FR-24. The system shall display reminders due today.

FR-25. The system shall display completed reminders separately.

FR-26. The system shall allow reminders to be filtered by category.

FR-27. The system shall allow reminders to be grouped by list.

---

## 7. Priority Management

FR-28. The system shall support multiple reminder priority levels (None, Low, Medium, High).

FR-29. The system shall visually distinguish reminders based on priority.

---

## 8. Data Synchronization and Persistence

FR-30. The system shall persist user data remotely using a backend service.

FR-31. The system shall synchronize reminders, categories, and lists across devices.

FR-32. The system shall handle loading and error states during data synchronization.

---

## 9. Navigation and Usability

FR-33. The system shall provide navigation between Home, Lists, Categories, and Reminder creation screens.

FR-34. The system shall provide feedback messages for successful and failed operations.

FR-35. The system shall prevent invalid operations (e.g., creating reminders without required fields).
