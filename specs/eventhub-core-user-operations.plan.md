# EventHub Core End-User Operations Test Plan

## Application Overview

Functional test plan for the EventHub demo application at https://eventhub.rahulshettyacademy.com/login. Each test assumes a fresh browser context and blank application state. Use a unique email address per registration-based scenario because the demo creates persistent sandbox data. Core end-user operations covered are account creation, authentication/session exit, event discovery, ticket booking, and booking management.

## Test Scenarios

### 1. Core End-User Workflows

#### 1.1. Register a new EventHub account

**File:** `tests/core/register-account.spec.ts`

**Steps:**

1. Open https://eventhub.rahulshettyacademy.com/login and select Register.


    - expect: The Create your account form is displayed with Email, Password, Confirm Password, and Create Account controls.

2. Enter a unique valid email address, for example qa.<timestamp>@example.com, and a password of at least 8 characters containing an uppercase letter, number, and symbol. Enter the same password in Confirm Password.


    - expect: The password requirements are satisfied.
    - expect: The confirmation value matches the password.

3. Select Create Account.


    - expect: The account is created successfully.
    - expect: The user is authenticated and redirected to the EventHub home page.
    - expect: The navigation displays the signed-in email and a Logout control.

4. Repeat the operation with an already-registered email.


    - expect: Registration is rejected with a clear duplicate-account error.
    - expect: The user is not incorrectly treated as newly registered.

5. Repeat with an invalid email, a weak password, and mismatched confirmation in separate attempts.


    - expect: Client or server validation identifies the invalid field.
    - expect: The account is not created until all required values are valid.

#### 1.2. Sign in and end an authenticated session

**File:** `tests/core/authenticate-session.spec.ts`

**Steps:**

1. Open the login page and submit a valid registered email with its correct password.


    - expect: The user is redirected to the authenticated EventHub home page.
    - expect: Authenticated navigation includes Events, My Bookings, the signed-in email, and Logout.

2. Sign out using Logout.


    - expect: The session ends and the user returns to the login page or unauthenticated state.
    - expect: Authenticated navigation and protected user data are no longer available.

3. Attempt to sign in with a valid email and an incorrect password.


    - expect: Sign-in is rejected with a clear authentication error.
    - expect: The user remains unauthenticated.

4. Submit the login form with blank email and/or password, then with malformed email input.


    - expect: Required-field or email-format validation is shown.
    - expect: No authenticated session is created.

#### 1.3. Discover events using search and filters

**File:** `tests/core/discover-events.spec.ts`

**Steps:**

1. Sign in and open Events from the main navigation.


    - expect: The Upcoming Events page displays event cards with event name, category, date, venue/city, and Book Now actions.

2. Enter a distinctive term such as World Tech Summit in the event search field.


    - expect: The list is narrowed to matching events.
    - expect: A non-matching search term produces an empty or no-results state without breaking the page.

3. Select a category such as Conference, then select a city such as Hyderabad.


    - expect: The event list reflects the selected category and city filters.
    - expect: Changing filters updates the visible results consistently.

4. Open an event from its title or Book Now action.


    - expect: The event detail page shows the event image, category, date, time, venue, city, availability, price, description, and booking form.

#### 1.4. Book tickets for an event

**File:** `tests/core/book-event.spec.ts`

**Steps:**

1. Sign in, open an available event, and inspect the ticket quantity control.


    - expect: The quantity starts at one ticket.
    - expect: The displayed total equals price per ticket multiplied by quantity.
    - expect: The maximum quantity rule is visible or enforced, including the stated maximum of 8 when applicable.

2. Increase the quantity, verify the total, then reduce it back to one ticket.


    - expect: The quantity changes by one per control activation.
    - expect: The total recalculates correctly and never becomes less than one.

3. Submit Confirm Booking with blank or invalid full name, email, or phone values.


    - expect: The booking is rejected with validation feedback.
    - expect: No booking confirmation is shown and no booking is added.

4. Enter a valid attendee name, registered email, valid phone number, and a valid ticket quantity, then select Confirm Booking.


    - expect: A Booking Confirmed state is displayed.
    - expect: A booking reference, customer name, ticket count, and total are shown.
    - expect: The event availability and total reflect the completed booking.

5. Attempt to book more tickets than the permitted maximum or more tickets than available capacity.


    - expect: The quantity limit or capacity is enforced.
    - expect: The application prevents an invalid booking and provides an actionable error.

#### 1.5. View and manage an existing booking

**File:** `tests/core/manage-booking.spec.ts`

**Steps:**

1. Starting with one confirmed booking, open My Bookings.


    - expect: The booking list shows the booking reference, status, event name, ticket count, location, booking date, total, View Details, and Cancel Booking controls.

2. Select View Details for the booking.


    - expect: The detail page shows event details, customer details, payment summary, booking date, booking ID, and current status.

3. Select Check eligibility for refund.


    - expect: A loading state appears while eligibility is checked.
    - expect: The completed response states whether the booking qualifies for a refund.

4. Select Cancel Booking and complete the confirmation action.


    - expect: The booking cancellation succeeds or is rejected with a clear reason.
    - expect: The booking status and My Bookings list update consistently.
    - expect: A canceled booking cannot remain displayed as confirmed.

5. Use Clear all bookings from My Bookings and confirm the action when prompted.


    - expect: All bookings belonging to the current user are removed or marked according to the product behavior.
    - expect: The empty-bookings state is displayed.
    - expect: The action does not affect another user's bookings.
