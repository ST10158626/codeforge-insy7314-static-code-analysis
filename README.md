# HustleHub+ API - Project Documentation / README (Part 1)

## Project Overview
HustleHub+ is a RESTful backend API built with Node.js and Express.js. The main aim of the project is to demonstrate a
well-structured, secure and maintainable backend for user authentication and protected user functionality.

### The project demonstrates:
* Professional project structure and documentation
* A clear API architecture and request flow
* User registration and login
* Input validation
* Password hashing with bcrypt
* JWT-based authentication
* Protected routes
* Appropriate HTTP status codes and error responses
* Security considerations and the reasoning behind design decisions

### Main Objectives
1.	 Build a REST API using Node.js and Express.js.
2.	 Separate routes, controllers, middleware and storage
responsibilities.
3.	 Validate user input before it reaches controller logic.
4.	 Secure passwords using bcrypt hashing.
5.	 Protect authenticated endpoints using JSON Web Tokens (JWT).
6.	 Return clear and meaningful error responses.
7.	 Document the request flow and architecture.
8.	 Explain why the major technical and security decisions were made.

### Explanation of the System
HustleHub+ is a secure freelance marketplace platform designed to connect freelancers with clients. Freelancers can advertise their services, while clients can browse available services and book freelancers.
The backend of the system is developed using Node.js and Express. It provides API endpoints that allow users to register, log in, and access authenticated functionality.
Since the application handles user accounts and sensitive information, security is an important part of the system. The application uses password hashing, token-based authentication, input validation and HTTPS to help protect users and their information.

### Intended Users
HustleHub+ is intended for the following users:
1. Freelancers - Freelancers use the platform to advertise their skills and services. They can create a profile and make their services available to potential clients.
2. Clients - Clients use the platform to browse available freelance services and book services that meet their requirements.
3. Administrators - Administrators can be responsible for managing the platform and monitoring users and system activity.



## Architecture Diagram
![alt text](documentation-images/architecture-diagram.png)

## Request Flow
A normal request follows this flow:
1.	 The client sends an HTTP request containing JSON data.
2.	 Express reads the JSON body using express.json().
3.	 The request is matched to the correct route.
4.	 Validation middleware checks the supplied input.
5.	 Invalid input is rejected with a 400 Bad Request response.
6.	 Valid input is passed to the controller.
7.	 The controller performs the required application logic.
8.	 Registration hashes the password before storing the user.
9.	 Login verifies the credentials and creates a JWT.
10.	 Protected routes verify the JWT before returning protected information.
11.	 The API sends a JSON response to the client.
12.	 Unknown routes are handled by the 404 handler.
13.	 Unexpected errors are handled by the global error handler.

### server.js
The main entry point. It loads environment variables, creates the Express application, enables JSON parsing, registers routes, provides
the health check, handles 404 responses and registers the global error handler.

### routes/
Defines API endpoints and connects them to middleware and controllers.

### controllers/
Contains the main authentication logic such as registration, duplicate-email checking, password hashing, login and JWT generation.

### middleware/
Contains reusable processing that happens before or around controller logic.
* inputValidation.js - validates request data.
* authMiddleware.js - verifies JWT bearer tokens.
* errorHandler.js - provides central error handling.

### storage/
Contains the current in-memory user store. The array-based store is suitable for demonstrating the API and can later be replaced with a database.

### certs/
Contains the locally configured SSL certificate and private key used to serve the application over HTTPS.

### .env
Stores sensitive configuration values such as secret keys. These values should not be exposed in the source code.

### Health Check
GET /api/health
Example response:
{
    "success": true,
    "status": "API is running"
}

### Register
POST /api/auth/register
Example request:
{
    "name": "John",
    "surname": "Smith",
    "email": "john@example.com",
    "password": "Password123"
}

A successful registration returns 201 Created.

Validation checks include:
* Required name
* Required surname
* Required email
* Required password
* Name length
* Surname length
* Email format
* Minimum password length

Invalid input must be rejected before an account is created.

### Login
POST /api/auth/login
Example request:
{
    "email": "john@example.com",
    "password": "Password123"
}
A successful login returns a JWT token that can be used to access protected routes.

### Profile
GET /api/users/profile
This endpoint is protected by JWT authentication.
The request must contain:
Authorization: Bearer JWT_TOKEN
The authentication middleware verifies the token before allowing access.

## Token Usage
![alt text](documentation-images/token-usage.png)

The JWT secret is stored in an environment variable instead of being hard-coded.
Example:
PORT=3000
JWT_SECRET=your_secret_key
The real .env file should not be committed to a public repository.

## Validation Approach
Input validation is implemented as middleware. This keeps validation separate from the main controller logic.
For example, an invalid registration request:
{
    "name": "J",
    "surname": "",
    "email": "not-an-email",
    "password": "123"
}
should be rejected with a 400 Bad Request response.

This approach:
* Prevents invalid data from reaching the controller
* Keeps controllers easier to read
* Makes validation reusable
* Provides predictable responses
* Reduces unnecessary processing

## Error Handling
The API uses HTTP status codes to communicate results.

* 200	- OK - Successful request
* 201	- Created - User successfully registered
* 400 - Bad Request - Invalid or missing input
* 401 - Unauthorized - Invalid credentials or JWT
* 404 - Not Found - Unknown API route
* 409 - Conflict - Email already registered
* 500 - Internal Server Error - Unexpected server error
* The API uses JSON responses so Postman and frontend applications can process the responses consistently.

## Security Rationale

### Password Hashing
Passwords are not stored as plain text. bcryptjs is used to hash passwords before they are stored.

![alt text](documentation-images/password-hashing.png)

During login, the submitted password is compared with the stored hash.

### JWT Authentication
JWT authentication protects endpoints that require an authenticated user.
The middleware rejects missing, invalid or expired tokens with 401 Unauthorized.

### Environment Variables
Sensitive configuration, particularly the JWT secret, is kept in .env and accessed through process.env.
This avoids placing secrets directly in source code.

## Why This Architecture Was Chosen
The project uses separation of responsibilities so that each part of the application has a clear purpose.

This is easier to maintain than placing all API functionality inside server.js.
It also makes future features easier to add. For example:
controllers/
    authController.js
    userController.js
    jobController.js

routes/
    authRoutes.js
    userRoutes.js
    jobRoutes.js

middleware/
    authMiddleware.js
    inputValidation.js
    errorHandler.js

## Running the Project
1. Install dependencies
Open the project in Visual Studio Code and run:
npm install

2. Configure .env
Create .env in the project root:
PORT=3000
JWT_SECRET=your_secret_key

3. Start the API
Run:
node src/server.js
Expected output:
HustleHub+ API running securely at: PORT 3444

## HTTPS Configuration
The application is now served over HTTPS using a configured SSL certificate. HTTPS encrypts communication between the client and the API, helping protect authentication credentials, JWT tokens and other data while it is transmitted. The API can therefore be tested using an HTTPS address rather than only an unsecured HTTP connection.
For local development, ensure the configured SSL certificate is available and that the HTTPS settings match the project's server configuration.

## Postman API Testing Collection
A Postman collection has been created for the HustleHub+ API to test all available API endpoints.
The collection covers:
* GET /api/health
* POST /api/auth/register
* POST /api/auth/login
* GET /api/users/profile
* Input validation tests
* Authentication/token testing
* Error-response testing

The collection provides a repeatable way to demonstrate that the API endpoints work correctly and that valid and invalid requests receive the expected responses.
For the protected profile endpoint, the JWT returned by the login request is used as a Bearer Token in the request authorization.
The Postman collection can also be used as evidence that the API has been systematically tested rather than only testing individual requests manually.

## Testing With Postman
1. Health Check
GET http://localhost:3000/api/health

2. Register
POST http://localhost:3000/api/auth/register
Body → raw → JSON:
{
    "name": "John",
    "surname": "Smith",
    "email": "john@example.com",
    "password": "Password123"
}

3. Test Validation
Try:
{
    "name": "J",
    "surname": "",
    "email": "invalid",
    "password": "123"
}
The request should be rejected with 400 Bad Request.

4. Login
POST http://localhost:3000/api/auth/login
Body:
{
    "email": "john@example.com",
    "password": "Password123"
}
Copy the returned JWT.

5. Test the Protected Route
GET http://localhost:3000/api/users/profile
In Postman:
Authorization -> Bearer Token -> Paste JWT
A valid token should allow access. A missing or invalid token should return 401 Unauthorized.

### Example Error Responses:

Validation Error
{
    "success": false,
    "error": "ValidationError",
    "message": "Invalid request data."
}

Unauthorized
{
    "success": false,
    "error": "Unauthorized",
    "message": "Invalid or expired token."
}

Route Not Found
{
    "success": false,
    "error": "NotFoundError",
    "message": "The requested route was not found."
}

## Key Design Decisions
* Express.js - Used as the HTTP server framework because it provides simple middleware and routing structure.
* Middleware - Used for validation, authentication and error handling so that these responsibilities are kept separate from controllers.
* bcryptjs - Used to avoid storing user passwords as plain text.
* JWT - Used for authentication so that the client can present a signed token when accessing protected endpoints.
* In-Memory User Store - Currently uses an array for simplicity during development. A database can be introduced later without redesigning the overall API structure.

## Future Improvements
* Replace the in-memory store with a database.
* Add role-based authorisation.
* Add refresh tokens.
* Add stronger password rules.
* Add automated unit tests.
* Add integration/API tests.
* Add Swagger/OpenAPI documentation.
* Add rate limiting.
* Add request logging.
* Add production configuration.
* Deploy the API to a cloud platform.

## Professional Development Practices Demonstrated
The project aims to demonstrate:
* Well-organised folder structure
* Separation of concerns
* Meaningful naming
* Input validation
* Secure password handling
* JWT authentication
* Consistent HTTP status codes
* Centralised error handling
* Environment-based configuration
* Clear API request flow
* HTTPS communication using an SSL certificate
* Postman collection covering all API endpoints
* Comments explaining important decisions
* Documentation of security choices

The focus is not simply making the API work, but demonstrating why each architectural, validation and security decision is made.


# HustleHub+ — frontend and backend source bundle (Part 2)

This folder contains the existing React/Vite frontend and Node/Express/Mongoose HTTPS API, plus security middleware, a freelancer income endpoint/page, and starter automated tests.

## Setup

1. Install Node.js (LTS) and make sure MongoDB Atlas or another replica-set-enabled MongoDB deployment is available. Booking creation uses MongoDB transactions.
2. In api, copy .env.example to .env; set JWT_SECRET to a long random value and set MONGODB_URI to your own database URI. Never upload .env.
3. In a terminal: cd api, then npm install, then npm run dev. The API uses HTTPS at https://localhost:3444.
4. In another terminal: cd frontend, then npm install, then npm run dev. Open the Vite URL printed in the terminal, normally http://localhost:5173.
5. Because the local API certificate is self-signed, accept/trust the certificate for local development if the browser blocks API calls. Do not use the development certificate in production.

## Tests

- Backend smoke/security tests: cd api && npm test
- Frontend rendering tests: cd frontend && npm test
- Frontend production build: cd frontend && npm run build
- Postman collection: import postman-collection/HustleHub+ API Tests - CodeForge.postman_collection.json; use https://localhost:3444 as the base URL and disable certificate verification only for local development if needed.
- Newman run: cd api && npm run test:newman (requires Newman and the Postman collection variables/accounts to be configured).

## Implemented functionality

- Registration/login with password hashing, JWT authentication and role-based access.
- Gig browsing and freelancer gig CRUD.
- Client booking creation/cancellation and freelancer booking completion.
- Simulated transaction records and GET /api/bookings/freelancer/income for the signed-in freelancer.
- Request validation, input sanitisation, security headers, JSON body limit, auth/booking rate limits and consistent 404/error responses.
- Freelancer income summary screen at /freelancer/income.

## Important limitations

- Transactions are simulated only; this is not a payment gateway or tax calculation service. totalIncome is a gross sum of eligible simulated transactions and is not tax advice.
- The automated tests are starter smoke/security/UI tests. Complete database-backed integration tests and run the full Postman suite against your own configured database before claiming all tests pass.
- The rate limiter is in-memory and suitable for local coursework/single-process development; use a shared store for multi-instance production deployments.


# HustleHub+ — (Part 3 - POE)

## Static Code Analysis
Due to GitHub organization restrictions, forking the original Classroom repository to a personal GitHub account was not permitted. Additionally, the original repository could not be connected directly to SonarQube Cloud because of organization-level permission restrictions. As a result, a separate personal repository was created to facilitate the integration of SonarQube Cloud and the execution of static code analysis through GitHub Actions. The personal repository contains the project's code, relevant commit history, and the SonarQube-integrated CI/CD pipeline. It is used to execute static code analysis and provide access to the corresponding analysis results.

**Personal Repository for Static Code Analysis:** https://github.com/ST10158626/codeforge-insy7314-static-code-analysis.git

### Forking Restriction
![alt text](documentation-images/forking-restriction.png)

### SonarQube Integration Restriction
![alt text](documentation-images/sonarqube-installation-restriction.png)

## Freelancer Income and Tax Estimation

The freelancer income page (`/freelancer/income`) displays the value of completed, non-cancelled simulated transactions. It provides three summary figures: gross income, estimated tax reserve and estimated after-tax income, together with proportional bars and transaction history.

### Tax estimation logic

The API calculates the estimate as follows:

1. Retrieve completed transactions belonging to the authenticated freelancer.
2. Exclude transactions linked to bookings that have been cancelled.
3. Add the remaining transaction amounts to calculate gross generated income.
4. Multiply gross income by the configured `TAX_ESTIMATE_RATE` (default `0.15`, or 15%).
5. Subtract estimated tax from gross income to show estimated after-tax income.

**Formula:** `estimatedTax = grossIncome × taxRate`; `afterTaxIncome = grossIncome − estimatedTax`.

For example, if eligible completed gigs generate R10,000 and the estimate rate is 15%, estimated tax is R1,500 and estimated after-tax income is R8,500. The API response includes `taxRate`, `estimatedTax`, `afterTaxIncome` and `taxMethod` alongside the income total.

To change the planning rate, add `TAX_ESTIMATE_RATE=0.15` to `api/.env`. Use a decimal between 0 and 1 (for example, `0.18` means 18%). This flat-rate estimate is deliberately presented as an illustrative reserve, not an official SARS tax calculation or tax advice. Real tax depends on an individual's taxable income, deductions, rebates and the tax rules for the relevant year. The rate is configurable so the demonstration assumption is transparent and can be changed without editing source code.

## Application Logging and Monitoring

The API writes structured, one-event-per-line JSON logs to `api/logs/application.log`. The log directory is created automatically. The following events are recorded:

| Event | Information captured | Why it matters |
|---|---|---|
| Login success | User ID, role, IP address and timestamp | Confirms successful account access and supports account activity reviews. |
| Login failure / blocked login | User ID when known, IP address, failed-attempt count and reason | Helps identify password guessing and suspicious access attempts. |
| Booking created, completed or cancelled | Booking ID, relevant user ID and event timestamp | Provides an audit trail for marketplace activity and disputes. |
| Transaction created | Transaction ID, booking ID, amount, status and type | Helps trace simulated payment records and reconcile booking activity. |
| API request | HTTP method, endpoint, response status, duration and IP address | Helps monitor usage, identify failing endpoints and investigate unusual traffic. |
| API error | Endpoint, status code, error type/message, user ID when available and IP address | Helps developers diagnose faults and identify repeated or suspicious errors. |

Passwords, password hashes, JWT tokens and full request bodies are deliberately not written to the logs. Logs are intended for operational monitoring and security investigation; they should be access-controlled and rotated/retained according to the deployment environment. In this development implementation, logs are stored locally in a file and are not yet sent to a central monitoring service.

## Additional Security Features

The system includes the following additional functional protections:

1. **Temporary account lockout:** After five consecutive incorrect password attempts for an existing account, login is blocked for 15 minutes. A successful login resets the counter. Expired locks are cleared when the user next attempts to log in. The API returns HTTP `423` while an account is locked. This adds account-level protection on top of the existing IP-based authentication rate limiter.
2. **Stronger password policy:** New registrations must use a password between 10 and 128 characters containing at least one uppercase letter, one lowercase letter, one number and one special character. Invalid passwords are rejected by registration validation before an account is created.

Other existing protections include bcrypt password hashing, one-hour JWT expiry, role-based route authorisation, request input validation/sanitisation, security headers, HTTPS for local API development, and separate rate limits for authentication and booking creation.


# References

* Express.js (2026) *Using middleware*. Available at:
https://expressjs.com/en/guide/using-middleware/ (Accessed: 4 September
2026).

* Express.js (2026) *Writing middleware for use in Express apps*.
Available at: https://expressjs.com/en/guide/writing-middleware/
(Accessed: 4 September 2026).

* Express.js (2026) *Error handling*. Available at:
https://expressjs.com/en/5x/guide/error-handling/ (Accessed: 4 September
2026).

* Express.js (2026) *Express FAQ*. Available at:
https://expressjs.com/en/starter/faq/ (Accessed: 4 September 2026).

* Node.js (2026) *Environment Variables*. Available at:
https://nodejs.org/api/environment_variables.html (Accessed: 4 September
2026).

* npm (2026) *dotenv*. Available at: https://www.npmjs.com/package/dotenv
(Accessed: 4 September 2026).