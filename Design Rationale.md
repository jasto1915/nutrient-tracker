# Design Rationale

---
###### PS/Note
### Objective
This project is done in part of Monash's DeepNeuron
On-Hit application stage 2. The objective is to code a small
project that solves an inconvenience in my life or something interesting

### Outline
This file will outline the steps taken from problem identification to final product,
highlighting what, how and why it is done.

---

### Problem Identification

**Problem-Background**: I remember when I had a meal from my own cooking and from restaurants, I wonder how much calories
and other nutritional values I was consuming. This is done because I wanted to ensure having enough calories to gain weight.
However, finding this information on the nutritional value of the food I had was hard. The food can vary in terms of portion and
ingredients. Standard apps that provide simillar functionality can only provide standard typical meals, and it leaves doubt
on whether the nutritional intake is accurate as to what I am eating. In addition, finding out what type of dish to 
cook that is suitable for my nutritional need for the rest of the day can be tricky as well. 

**Solution**: Nutrient Tracker App; An app that can take in input of what food we eat,
identify its nutritional content based on publicly available information, track history of our nutrition
intake, measure our nutrition intake with the ideal nutrition intake based on our goal (ex. gain weight, lose weight),
suggest foods to eat for the rest of the day based on nutrition needs for goal


**Reasoning**: I chose this problem because it relavant to my daily life, useful, solves a problem, enough complexity
and feasible to do within a week. 
I enjoy building IT solutions to a problem that is present in everyday life. I also understood that the functionality 
to be implemented, such as taking input and using the internet to find information on the nutritional information is 
feasible to do within a week. Ideally, I would also like to make the app able to take a picture of the food
and analyze it. However, with time constraints and doubts on the feasibility to execute this feature on the tester's device,
I think that inputting nutritional information and providing guidance and rough measurement, is already a great step forward.


**Thought Process**: I look towards my own life and identify problems that can be solved
with programming or perhaps things that can be improved further. After giving it some thought, there
are some ideas that occured, such as the language app I mentioned in the application, file manager automation,
food tracker, and expense tracker. The selection of ideas can not be released from its context either,
it must be an idea that is feasible to do in a week and that can also showcase smart features, simillar to the
app examples given in the application info.

### Solution Architecture/Technology

**Decision**: 
Web Application using MEAN stack
_Functionality_
- Nutrient Measurement
  - Provide UI for user to input natural language based input, such as "For breakfast, I ate a whole grain bread with 
  peanut butter jam"
  - Provide text to guide user on providing enough information with focus on ingredient and portion
  - Provide user to edit summarized meal info [for later stages]

-Nutrient Tracking
    - Record what meal user ate, nutrients contained in it, and saving it into the database
    - Record User's info such as weight, height, gender, etc. in relation to the goal
    - Provide nutrient goals for user and the discprency between the daily goal and what they have consumed

-Nutrient Suggestion
    - Provide suggestions to user on what meal to eat based on nutrient goals
    - User can choose meal preferences before system providing suggestions (ex. japanese food) [if applicable]

_Tech Stack_
- Front-end: Angular
- Database: MongoDB
- Back-end: Node.js - Express.js - Javascript
- Hosting: Firebase

_Timeline_
17 Jan: Build most of the back-end with simple front end
18 Jan: Finish buiding back-end and develop front end to a suitable fidelity and complexity
19 Jan: Test, Document, and host the web app in firebase
20 Jan: If time permits, then continue developing front end and update to hosting.

_Feature milestone_
- Nutrient Measurement
  - Mile 1
    - setup simple input and output panel for frontend [DONE]
    - setup backend with express and mongodb connection [DONE]
    - build routing from front end to backend to receive text input [DONE]
  - Mile 2
    - build external api to send text input and get back food type [DONE]
    - build routing to send back meal info to display to user

explain about why you structure the project liek that (router, controller, etc.)

**Reasoning**: The reason to chose a web app is because of its well-suited structure for our requirements and ease of use.
Firstly, we need a good UI (in preperation for possible later stages), a structure that can call API requests, and handle database
queries, while also being done in good principles (ex. SOLID). Web app is able to fulfill this requirements. Web app, with 
frameworks such as express, supports and eases the build process for connecting to external API's and databases. 
With Javascript and tools such as mongoose, it enables good coding practices, such as seperation of concern and a strict schema.
Web apps has naturally evolved to be suited for API requests and database connections. In addition, web apps are simple
to deploy and require no setup from the tester. In comparison, desktop apps require additional configuration and deployment
for each platform and install/setup from the user.

Regarding the tech stack, Node.js - Express.js has been a proven solution to build robust web apps. It also simplifies 
development which is essential with the current time constraint. MongoDB is the suitable choice for database because
our requirement is to save meals and their associated nutrient info, as well as the user's info. These informations
that can be classified into per documents and have their unique values, is suited to the structure of MongoDB. MongoDB
would also use its atlas version (atlas is its online version; use local version first for development), so that database
can be hosted online. In addition, the front end has more breadth for choosing the framework, as most used ones are 
simillar in functionality. Hence, I chose the one of which I am most familiar with which is Angular. Lastly,
hosting will use firebase, because its free tier provide free hosting for front and back end.


**Thought Process**: Building an app that received user input can be done through Web app, Desktop/mobile app, or just a script
and a shell for input. Certainly, the end goal which is most convenient for the user is not a shell script. However, with 
the time constraint, I plan to focus to build the back-end and logic first, with a simple user input first if needed
for testing. The front-end can be developed in the later stages. In our app, there are then three main features,
nutrition measurement, nutrition tracker, nutrition suggestion, with main services which is data persistence and 
https api requests. The platform I deploy must also be easy to use for the testers. With all these considerations, a 
web app is most suitable for the task (explanation in Reasoning section)


