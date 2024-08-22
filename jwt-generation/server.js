const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  const secretKey = 'yourSecretKey'; // Replace with your own secret key
  const options = {
    expiresIn: '24h', // Token expiration time
  };

  const token = jwt.sign(payload, secretKey, options);
  return token;
};

const user = {
    email: "magnus.teschner@reutlingen-university.de",
    firstname: 'Magnus',
    lastname: 'Teschner',
  };
const jwt_token = generateToken(user);
console.log(jwt_token.payload);



const validateToken = (token) => {
    console.log(jwt_token);
    
    jwt.verify(token, 'yourSecretKey', (err, payload) => {
      if (err) {
        console.log({
          success: false,
          message: 'Invalid token',
        });
      } else {
        console.log(payload)
      }
    });
};

validateToken(jwt_token);