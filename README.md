added firebase firestore

api keys will be listed here.

**HOW TO USE BACKEND SERVER**

1.Get you own Firebase Firestore project or send your email to 'Mon' naja

2.Download your Firebase service account key or ask for the key from 'Mon' naja

3.npm install in backend directory

4.Create .env file put these following variables inside the file

PORT = 3000

FIREBASE_PROJECT_ID=

FIREBASE_CLIENT_EMAIL=

FIREBASE_PRIVATE_KEY=

5.Put keys you've downloaded or got from 'Mon' to those variables above

6.Open Terminal or Command Shell and use command "ifconfig | grep inet" and copy your inet IP (Something which is not a 127.xxx.xx.xx and it depends on WIFI you use, if you change WIFI inet IP will also change. So you have to change your IP in the code again)

7.Use search tool on the left hand tabs of vscode and seach for '192.168.1.3', replace your inet IP to these.

8.Run 'npx nodemon server.js'

9.Test API with postman or something with GET 'http:/your-ip/' if it returns 'server is running' that's mean it works

10.Try testing API with database by using POST 'http:/your-ip/disability/' and put RAW JSON in the body as
{
"username": "tes",
"password": "1234",
"gender": "Male",
"birth_date": "2025-10-29",
"phone_number": "1234567890",
"emergency_contact": "1234567890",
"diagnosis": "Autism",
"user_role": "disability"
}
it will return success message if the database works

11.Don't forget to add .env to .gitignore file before pushing to github or you will get critical error message

---Contact Nong Mon for help with backend ja---
