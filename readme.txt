
- `data/`: Placeholder for your data files.
- `node_modules/`: Node.js dependencies.
- `package.json`: Project configuration and dependencies.
- `package-lock.json`: Lock file for precise package versions.

### Source Files

- `apicontrollers/`: Contains API controllers handling different endpoints.
- `config/`: Configuration files for database, etc.
- `daos/`: Data Access Objects for database interactions.
- `models/`: Database models.
- `schemas/`: Schemas for data validation.
- `services/`: Business logic layer.
- `utils/`: Utility functions and helpers.

## Usage

1. Install dependencies:
   ```bash
   npm install  
   npm run watch to run





Routes
All routes are registered in app.js.

API Controllers
API controllers handle specific endpoints. They perform data validation, call services, and return responses.

Services
Services contain business logic. They call DAO layer for database queries, but do not write queries themselves.

DAOs
Data Access Objects interact with the database. They handle queries and database operations.

Important Note
Never write queries directly in the service layer. Use DAOs for database interactions