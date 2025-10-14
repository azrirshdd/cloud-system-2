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



