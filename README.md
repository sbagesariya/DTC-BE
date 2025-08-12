# DTC-BE

### Setup
1. Clone Repository
2. Install Latest version of node: https://nodejs.org/en/ 
3. Check out **master** branch
4. Go into root directory of DTC project **cd DTC-BE**
5. Install dependecies by **npm install**
6. Create **config** directory and then **config.js** file in config directory with below format
  ```
  module.exports = {
      aws_config: {
          region: "local",
          endpoint: "http://localhost:8000",
          accessKeyId: "fakeMyKeyId",
          secretAccessKey: "fakeSecretAccessKey"
      }
    }; 
```
7. Start NodeJs server by **npm start** 
8. To run test run **npm test**

## Setup DynamoDB Locally
1. Download latest DynamoDB for free using https://s3.ap-south-1.amazonaws.com/dynamodb-local-mumbai/dynamodb_local_latest.zip
2. After you download the archive, extract the contents and copy the extracted directory to a location of your choice.
3. To start DynamoDB on your computer, open a command prompt window, navigate to the directory where you extracted DynamoDBLocal.jar, and enter the following command.
```
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```
4. you can see your DB running here **http://localhost:8000/shell/** 
***To run DynamoDB on your computer, you must have the Java Runtime Environment (JRE) version 8.x or newer. The application doesn't run on earlier JRE versions.**
 
