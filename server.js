const express = require("express");
const path = require("path");
const AWS = require("aws-sdk");
const req = require("express/lib/request");
const res = require("express/lib/response");
const ACCESS_KEY = require("./security");
const SECRET_ACCESS_KEY = require("./security");

const app = express();
const port = process.env.PORT || "5600";

app.use(express.urlencoded({extended: true}));
app.use(express.json());

let awsConfig = {
    "region": "us-east-2",
    "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
    "accessKeyId": ACCESS_KEY, 
    "secretAccessKey": SECRET_ACCESS_KEY
};
AWS.config.update(awsConfig);   //AWS.config will takes all the details for database connections and validate the connection and initialize the connection with amazon DynamoDB

let docClient = new AWS.DynamoDB.DocumentClient();

app.get("/", (req, res)=>{
    res.status(200).send("Great! Express app is listening.")
});

app.post("/feedback", (req, res)=>{
    let body=req.body;
    console.log(body);
    let input = {
        "feedbackId": body.feedbackId,
        "questionOne": body.questionOne,
        "questionTwo": body.questionTwo,
        "questionThree": body.questionThree,
        "questionFour": body.questionFour
    };
    let params = {
        TableName: "feedback",
        Item: input
    };
    docClient.put(params, function (err, data) {

        if (err) {
            console.log("feedback::save::error - " + JSON.stringify(err, null, 2));
            res.status(404).send("Oops! Feedback was not saved in dynamoDB");
        } else {
            console.log("feedback::save::success");
            res.status(200).send("Great! Feedback was saved in dynamoDB");
        }
    });
});

app.listen(port, ()=>{
    console.log("Listening at",port)
});