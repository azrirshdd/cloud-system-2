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

C:\Users\USER>cd "C:\Program Files\MongoDB\Server\8.2\bin"

C:\Program Files\MongoDB\Server\8.2\bin>dir
 Volume in drive C has no label.
 Volume Serial Number is FEA2-42FF

 Directory of C:\Program Files\MongoDB\Server\8.2\bin

09/10/2025  12:38 PM    <DIR>          .
09/10/2025  12:38 PM    <DIR>          ..
30/09/2025  10:06 PM             1,558 InstallCompass.ps1
09/10/2025  12:48 PM               539 mongod.cfg
30/09/2025  10:45 PM        77,217,280 mongod.exe
30/09/2025  10:45 PM     1,217,785,856 mongod.pdb
30/09/2025  10:45 PM        50,398,720 mongos.exe
30/09/2025  10:45 PM       815,575,040 mongos.pdb
               6 File(s)  2,160,978,993 bytes
               2 Dir(s)  166,109,560,832 bytes free

C:\Program Files\MongoDB\Server\8.2\bin>mongosh
Current Mongosh Log ID: 68ef78a64a634fbaa7cebea3
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.8
Using MongoDB:          8.2.1
Using Mongosh:          2.5.8

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/


To help improve our products, anonymous usage data is collected and sent to MongoDB periodically (https://www.mongodb.com/legal/privacy-policy).
You can opt-out by running the disableTelemetry() command.

------
   The server generated these startup warnings when booting
   2025-10-15T00:12:39.894+08:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
------

test> use testDB
switched to db testDB
testDB> db.users.find()
[
  { _id: ObjectId('68ea753cea6d1c2194a07176'), name: 'azri', age: 22 },
  { _id: ObjectId('68ee4893ca1185abbe8629b3'), name: 'Alice', age: 25 },
  { _id: ObjectId('68ee49f19619a017e597f819'), name: 'Alice', age: 25 },
  { _id: ObjectId('68ee52cf647d80ebf6b9f1e5'), name: 'Azri', age: 22 },
  { _id: ObjectId('68ee569db8f3dd6867dad5be'), name: 'Azri', age: 22 },
  { _id: ObjectId('68ee6c8c68870b02aea541cc'), name: 'Alice', age: 25 },
  { _id: ObjectId('68ee6c92a8b2b556d78296ee'), name: 'Alice', age: 25 },
  { _id: ObjectId('68ee700e1d43723a58088121'), name: 'Alice', age: 25 },
  { _id: ObjectId('68ee76874ff1c7d93481ce9a'), name: 'Azri', age: 22 },
  { _id: ObjectId('68ee768f5580aef2d92e08e5'), name: 'Azri', age: 22 },
  { _id: ObjectId('68ee7a90d3a016511c74a6b2'), name: 'Alice', age: 25 },
  { _id: ObjectId('68ee7b52ba33f723b3a53004'), name: 'Alice', age: 25 },
  { _id: ObjectId('68ee7b68fbdde63f657b15cd'), name: 'Alice', age: 25 }
]
testDB>

5.	File System & Dependencies 
o	What is the absolute path to your project’s package-lock.json file? 
"C:\Users\USER\Documents\cloud system\package.json"
o	What exact version of the mongodb driver is installed? 
mongodb@6.20.0

6.	Troubleshooting Practice o Stop the MongoDB service and run the script. 
•	What error occurs? 
Error MongoServerSelectionError: connect ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017
•	What command restarts the service? 
Net start MongoDB

7.	GitHub Repository Structure o On GitHub, navigate to your repository’s. 
•	What timestamp is listed for your last commit?
37d1dfb· 12 minutes ago
•	How many files are present in this branch? 
There are 6 files present in this branch

8.	Performance Observation o Time how long it takes for the script to print "Connected	to	MongoDB!". 
•	What is the duration (in milliseconds)?
52ms
•	Does this time change if you run the script again? Why? 
Yes, there a few things can caused the connection time differently, one factor is, it is because that there isn’t enough RAM available. It can make the vs code take  longer to run a program. Also, the performance of the system depends on how busy it is. If CPU is running several software processes at once, it makes the makes connections and execution take longer







