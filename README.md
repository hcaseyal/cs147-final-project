To use: 

```
git clone https://github.com/hcaseyal/cs147-final-project
cd cs147-final-project
npm install
node webServer.js
```
For Ubuntu users

```
git clone https://github.com/hcaseyal/cs147-final-project
cd cs147-final-project
sudo apt install npm
sudo apt install nodejs-legacy
npm install express
node webServer.js
``` 

Navigate to http://localhost:3000/ 

Limitations:
The prototype is not actually synced with ExploreCourses / Axess. Doing so would require months of collaboration and negotiation with Stanford University.

There is only one usable user account (teacher and student) for demonstration purposes. Full account creation / login has not been implemented as it is not core to demonstrating our product.

Personalization has not been full fleshed out. The fully developed product would have a much more extensive profile page and profile setting options, where you could set your career history and profile picture.

The real product would also have more filters on the viewing feedback page for each class and probably a rating system for users to vote for which reviews were most useful, and we would display the most useful reviews first.

There is currently no vetting for appropriateness of student reviews. The actual product would have site moderators as well as some NLP to prevent inappropriate reviews. Also, all user accounts would have to be verified and linked to a real former or current student, which would greatly discourage inappropriate reviews. 

The real product would only let students review classes that they have actually taken, as verified by Axess, and let teachers edit the feedback form only for class iterations that they have taught. 

All reviews, ratings, and skills are hard-coded . 

In practice, there would be many more reviews / data than what we supply, potentially hundreds. 



