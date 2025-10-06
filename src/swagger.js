
import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Gritdash API',
    description: 'Gritdash API Documentation',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/App.js'];

swaggerAutogen()(outputFile, endpointsFiles, doc);
