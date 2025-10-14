Answer these by completing the lab steps and observing results. 
1.	Code Execution & Output o After running your index.js script: 
•	What exact text does the console display when the document is inserted?
Connected to MongoDB!
Document Inserted!
•	What _id value is automatically assigned to the document?
Query result: {_id: ObjectId, name: 'Alice', age: 25}

2.	Modify and Observe o Change the name field in index.js to your own name and the age to your birth year. Run the script again. 
•	What new _id is generated for this document?
Query result: {_id: ObjectId, name: 'Azri', age: 22}
•	What error occurs if you forget to call await	client.connect()?  
No error occurred, the program is still running as usual

3.	MongoDB Connection Failure o Intentionally break the MongoDB connection string (e.g., change the port to 27018). 
•	What error message does NodeJS throw? 
Error MongoServerSelectionError: connect ECONNREFUSED ::1:27018, connect ECONNREFUSED 127.0.0.1:27018
•	What is the exact text of the error code (e.g., ECONNREFUSED)?
Means the connection to MongoDB failed because Node.js did not receive any response from the server

4.	MongoDB Shell Query 
o	Use the MongoDB shell (not Compass) to: 
•	List all documents in the testDB.users collection. 
•	What command did you use? Paste the full output.

6.	File System & Dependencies 
o	What is the absolute path to your project’s package-lock.json file? 
"C:\Users\USER\Documents\cloud system\package.json"
o	What exact version of the mongodb driver is installed? 
mongodb@6.20.0

6.	Troubleshooting Practice o Stop the MongoDB service and run the script. 
•	What error occurs? 





