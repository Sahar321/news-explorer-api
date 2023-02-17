# News Explorer
News Explorer is a web application that allows users to search for news* articles and save them to their account. This repository contains the backend code for the application, which was built using Node.js, Express, and MongoDB.<br />

## Getting Started
To get started with News Explorer, follow these steps:

1. Clone the repository to your local machine
2. Install the dependencies using `npm install`
3. Create a `.env` file in the root directory and add the necessary environment variables (see the .env.example file for guidance)
4. Start the server using `npm start` or `npm run dev` for development mode
5. Visit http://localhost:3001 in your web browser to use the application


Authentication
News Explorer uses JSON Web Tokens (JWT) for authentication. When a user logs in, a JWT is generated and sent back to the client. This token is then stored on the client-side and sent with every subsequent request to the server. The server verifies the authenticity of the token and grants or denies access to protected resources based on the token's validity. This approach to authentication allows News Explorer to maintain user sessions without relying on cookies, which can be vulnerable to cross-site scripting attacks.

## Dependencies
News Explorer relies on the following dependencies:

**bcryptjs**: for hashing and verifying passwords<br />
**body-parser**: for parsing incoming request bodies<br />
**celebrate**: for validating request data<br />
**cors**: for enabling Cross-Origin Resource Sharing (CORS)
**cross-fetch**: for making HTTP requests<br />
**dotenv**: for loading environment variables<br />
**express**: for building the server<br />
**express-rate-limit**: for limiting the number of requests a client can make in a given time period<br />
**express-winston**: for logging HTTP requests and responses<br />
**google-auth-library**: for authenticating users using Google OAuth2<br />
**helmet**: for setting HTTP headers to improve security<br />
**jsonwebtoken**: for generating and verifying JWTs<br />
**mongodb**: for interacting with the MongoDB database<br />
**mongoose**: for modeling data in MongoDB<br />
**validator**: for validating and sanitizing input data<br />
**winston**: for logging messages to the console and/or a file<br />

### Development Dependencies
**eslint**: for linting the code<br />
**eslint-config-airbnb**: for configuring eslint to follow Airbnb's JavaScript style guide<br />
**eslint-config-airbnb-base**: for configuring eslint to follow Airbnb's JavaScript style guide (without React)<br />
**eslint-plugin-import**: for validating import/export statements<br />
**nodemon**: for automatically restarting the server when changes are made to the code<br />

## url: https://api.samnews.students.nomoredomainssbs.ru

## Autor 
Sahar Moshe

## Project Link
The News Explorer API is deployed on a server and can be accessed using the following URL: https://api.samnews.students.nomoredomainssbs.ru

## Conclusion
Thanks for checking out News Explorer! If you have any questions or feedback, please feel free to open an issue or reach out to me directly.

##### *News Explorer uses NewsAPI as its primary source of news data.
