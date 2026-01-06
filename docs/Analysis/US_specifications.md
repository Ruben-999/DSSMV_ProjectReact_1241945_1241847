## UC 1 – Register User

| **Field** | **Description** |
|---------|----------------|
| **Description** | Allows a new user to create an account in the system (Create operation). |
| **Pre-Conditions** | The user is not authenticated and has an active internet connection. |
| **Post-Conditions** | A new user account is created and stored in the DB. |
| **Basic Flow** | 1. The user enters registration data (name, email, password);<br>2. The user confirms the registration;<br>3. The system validates the data;<br>4. The system sends the data to the backend API;<br>5. The system confirms success and creates the account. |
| **Alternative Flow** | Invalid or incomplete data: the system rejects the request and shows an error message. |

---

## UC 2 – Login User

| **Field** | **Description** |
|---------|----------------|
| **Description** | Authenticates a user in the system (Read operation). |
| **Pre-Conditions** | The user has a registered account and internet access. |
| **Post-Conditions** | The user is authenticated and gains access to the application. |
| **Basic Flow** | 1. The user enters email and password;<br>2. The user submits the login form;<br>3. The system validates credentials;<br>4. The system authenticates via the API;<br>5. The system grants access to the app. |
| **Alternative Flow** | Invalid credentials: the system denies access and displays an error message. |

---

## UC 3 – Logout User

| **Field** | **Description** |
|---------|----------------|
| **Description** | Ends the user session (Update operation). |
| **Pre-Conditions** | The user is authenticated. |
| **Post-Conditions** | The user session is terminated. |
| **Basic Flow** | 1. The user selects the logout option;<br>2. The system clears session data;<br>3. The system redirects to the login screen. |
| **Alternative Flow** | Not applicable. |

---

## UC 5 – Edit Category

| **Field** | **Description** |
|---------|----------------|
| **Description** | Updates an existing category (Update operation). |
| **Pre-Conditions** | The user is authenticated and the category exists. |
| **Post-Conditions** | The category information is updated. |
| **Basic Flow** | 1. The user selects a category;<br>2. The user edits category details;<br>3. The system validates the data;<br>4. The system updates the category via the API;<br>5. The system confirms success. |
| **Alternative Flow** | Invalid data: the system rejects the update. |

---

## UC 7 – Select Active Category

| **Field** | **Description** |
|---------|----------------|
| **Description** | Sets a category as the active filter (Update operation). |
| **Pre-Conditions** | The user is authenticated and categories exist. |
| **Post-Conditions** | The selected category becomes the active filter. |
| **Basic Flow** | 1. The user selects a category;<br>2. The system marks it as active;<br>3. The system updates the displayed reminders. |
| **Alternative Flow** | Category not found: the system keeps the previous selection. |

---

## UC 8 – Create List

| **Field** | **Description** |
|---------|----------------|
| **Description** | Creates a new list to group reminders (Create operation). |
| **Pre-Conditions** | The user is authenticated and connected to the internet. |
| **Post-Conditions** | A new list is added to the system. |
| **Basic Flow** | 1. The user enters list details;<br>2. The user confirms creation;<br>3. The system validates the data;<br>4. The system stores the list via the API;<br>5. The system confirms success. |
| **Alternative Flow** | Invalid data: the system rejects the creation. |

---

## UC 10 – Delete List

| **Field** | **Description** |
|---------|----------------|
| **Description** | Removes an existing list (Delete operation). |
| **Pre-Conditions** | The user is authenticated and the list exists. |
| **Post-Conditions** | The list is removed from the system. |
| **Basic Flow** | 1. The user selects a list;<br>2. The user confirms deletion;<br>3. The system deletes the list via the API;<br>4. The system updates the UI. |
| **Alternative Flow** | Deletion cancelled: no changes are made. |

---

## UC 12 – Create Reminder

| **Field** | **Description** |
|---------|----------------|
| **Description** | Creates a new reminder (Create operation). |
| **Pre-Conditions** | The user is authenticated and has internet access. |
| **Post-Conditions** | A new reminder is added to the system. |
| **Basic Flow** | 1. The user enters reminder details;<br>2. The user submits the form;<br>3. The system validates the data;<br>4. The system stores the reminder via the API;<br>5. The system confirms success. |
| **Alternative Flow** | Invalid data: the system displays an error message. |

---

## UC 13 – Edit Reminder

| **Field** | **Description** |
|---------|----------------|
| **Description** | Updates an existing reminder (Update operation). |
| **Pre-Conditions** | The user is authenticated and the reminder exists. |
| **Post-Conditions** | The reminder is updated. |
| **Basic Flow** | 1. The user selects a reminder;<br>2. The user edits its details;<br>3. The system validates the data;<br>4. The system updates the reminder via the API;<br>5. The system confirms success. |
| **Alternative Flow** | Invalid data: the update is rejected. |

---

## UC 14 – Delete Reminder

| **Field** | **Description** |
|---------|----------------|
| **Description** | Deletes a reminder (Delete operation). |
| **Pre-Conditions** | The user is authenticated and the reminder exists. |
| **Post-Conditions** | The reminder is removed from the system. |
| **Basic Flow** | 1. The user selects a reminder;<br>2. The user confirms deletion;<br>3. The system deletes the reminder via the API;<br>4. The system updates the list. |
| **Alternative Flow** | Deletion cancelled: no changes are made. |

---

## UC 15 – Mark Reminder as Completed

| **Field** | **Description** |
|---------|----------------|
| **Description** | Marks a reminder as completed (Update operation). |
| **Pre-Conditions** | The user is authenticated and the reminder exists. |
| **Post-Conditions** | The reminder status is updated to completed. |
| **Basic Flow** | 1. The user selects a reminder;<br>2. The user marks it as completed;<br>3. The system updates the status via the API;<br>4. The system refreshes the UI. |
| **Alternative Flow** | Update fails: the system shows an error message. |

---

## UC 17 – View Completed Reminders

| **Field** | **Description** |
|---------|----------------|
| **Description** | Displays all completed reminders (Read operation). |
| **Pre-Conditions** | The user is authenticated. |
| **Post-Conditions** | Completed reminders are displayed. |
| **Basic Flow** | 1. The user navigates to completed reminders;<br>2. The system retrieves completed reminders;<br>3. The system displays the results. |
| **Alternative Flow** | No completed reminders: the system displays an empty state. |
