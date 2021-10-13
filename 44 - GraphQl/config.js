const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(process.cwd(), process.env.NODE_ENV + '.env')
});



module.exports = {    
    PORT: process.env.PORT || 8000,    
    graphql: process.env.graphql
}