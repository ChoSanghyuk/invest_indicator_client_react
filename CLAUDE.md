# Investment Indicator Application - Claude Guidelines



## overview

This is a web application written in React Native. It interacts with the invest indicator server which has my current investment status, market status etc. As the server itself can be changed or expanded, this project also needs to be designed for easy expanstion with modularity.



## Specification Documents Reference

When implementing or modifying features, always reference the relevant specification documents:

### Common Specifications
- **spec/common/types.md** - Data models, enums, and type definitions
- **spec/common/authentication_authorization.md** - Authentication and authorization rules
- **spec/common/error_handle.md** - Error handling and HTTP status codes

### API Specifications
- **spec/auth/api.md** - When implementing authentication endpoints
- **spec/market/api.md** - When implementing market-related endpoints
- **spec/asset/api.md** - When implementing asset management endpoints
- **spec/fund/api.md** - When implementing fund management endpoints
- **spec/investment/api.md** - When implementing investment tracking endpoints
- **spec/event/api.md** - When implementing event handling endpoints
- **spec/model/api.md** - When implementing model-related endpoints

## Project Rules

- **IMPORTANT**: apply vercel-react-best-practices
- Follow the specifications exactly as defined
- Common specs (authentication, authorization, error handling) apply to all endpoints
- Verify authentication and authorization requirements before implementation
- Use correct data types and enums as defined in spec/common/types.md
- The project can be built with mock data or real API - this should be controlled by configuration
- Whether to use mock or real API should be decided by config settings

## Test Rules

- **IMPORTANT**: in the test codes, use mock for the backend server.
- Write tests covering happy path and error cases
- Test authentication and authorization flows
- Validate all error responses match spec/common/error_handle.md
- Test with both admin and non-admin users where applicable



