# Design Rationale

---

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
ingredients. Standard apps that provide similar functionality can only provide standard typical meals, and it leaves doubt
on whether the nutritional intake is accurate as to what I am eating. In addition, finding out what type of dish to 
cook that is suitable for my nutritional need for the rest of the day can be tricky as well. 

**Solution**: Nutrient Tracker App; An app that can take in input of what food we eat,
identify its nutritional content based on publicly available information, track history of our nutrition
intake, measure our nutrition intake with the ideal nutrition intake based on our goal (ex. gain weight, lose weight),
suggest foods to eat for the rest of the day based on nutrition needs for goal


**Reasoning**: I chose this problem because it relevant to my daily life, useful, solves a problem, enough complexity
and feasible to do within a week. 
I enjoy building IT solutions to a problem that is present in everyday life. I also understood that the functionality 
to be implemented, such as taking input and using the internet to find information on the nutritional information is 
feasible to do within a week. Ideally, I would also like to make the app able to take a picture of the food
and analyze it. However, with time constraints and doubts on the feasibility to execute this feature on the tester's device,
I think that inputting nutritional information and providing guidance and rough measurement, is already a great step forward.


**Thought Process**: I look towards my own life and identify problems that can be solved
with programming or perhaps things that can be improved further. After giving it some thought, there
are some ideas that occurred, such as the language app I mentioned in the application, file manager automation,
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
    - Provide nutrient goals for user and the discrepancy between the daily goal and what they have consumed

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
18 Jan: Finish building back-end and develop front end to a suitable fidelity and complexity
19 Jan: Test, Document, and host the web app in firebase
20 Jan: If time permits, then continue developing front end and update to hosting.


**Reasoning**: The reason to choose a web app is because of its well-suited structure for our requirements and ease of use.
Firstly, we need a good UI (in preparation for possible later stages), a structure that can call API requests, and handle database
queries, while also being done in good principles (ex. SOLID). Web app is able to fulfill this requirements. Web app, with 
frameworks such as express, supports and eases the build process for connecting to external API's and databases. 
With Javascript and tools such as mongoose, it enables good coding practices, such as separation of concern and a strict schema.
Web apps has naturally evolved to be suited for API requests and database connections. In addition, web apps are simple
to deploy and require no setup from the tester. In comparison, desktop apps require additional configuration and deployment
for each platform and install/setup from the user.

Regarding the tech stack, Node.js - Express.js has been a proven solution to build robust web apps. It also simplifies 
development which is essential with the current time constraint. MongoDB is the suitable choice for database because
our requirement is to save meals and their associated nutrient info, as well as the user's info. These information
that can be classified into per documents and have their unique values, is suited to the structure of MongoDB. MongoDB
would also use its atlas version (atlas is its online version; use local version first for development), so that database
can be hosted online. In addition, the front end has more breadth for choosing the framework, as most used ones are 
similar in functionality. Hence, I chose the one of which I am most familiar with which is Angular. Lastly,
hosting will use firebase, because its free tier provide free hosting for front and back end.


**Thought Process**: Building an app that received user input can be done through Web app, Desktop/mobile app, or just a script
and a shell for input. Certainly, the end goal which is most convenient for the user is not a shell script. However, with 
the time constraint, I plan to focus to build the back-end and logic first, with a simple user input first if needed
for testing. The front-end can be developed in the later stages. In our app, there are then three main features,
nutrition measurement, nutrition tracker, nutrition suggestion, with main services which is data persistence and 
https api requests. The platform I deploy must also be easy to use for the testers. With all these considerations, a 
web app is most suitable for the task (explanation in Reasoning section)


### Code Building

_Feature milestone_
- Nutrient Measurement
  - Mile 1
    - setup simple input and output panel for frontend [DONE]
    - setup backend with express and mongodb connection [DONE]
    - build routing from front end to backend to receive text input [DONE]
  - Mile 2
    - build external api to send text input and get back food type [DONE]
    - build routing to send back meal info to display to user [DONE]
  - Mile 3
    - add time to meal input [DONE]
    - fix and clean meal data that is passed to the backend and vice versa [DONE]
  - Mile 4
    - create ok button for user to agree to the meals added [DONE]
    - send the meal to the database [DONE]
  - Mile 5
    - add interface for user info, which is name, age, gender, height, weight, and goal [DONE]
    - setup backend to save user info [DONE]
  - Mile 6
    - Research formula for nutrient intake per goal [DONE]
    - compute nutrient goal per day [DONE]
    - send the nutrient goal to the front end [DONE]

- Nutrient Tracking
  - Mile 1
    - create simple display of what has been eaten for the day and their nutrients [DONE]
    - connect to the backend and provide the info to the front end [DONE]
  - Mile 2
    - display nutrient accumulation and what is left to reach the daily goal [DONE]
    - create history section to display which nutrient goals are achieved and which are not per day [DONE]
  - Mile 3
    - create button for daily reset [DONE]
    - create daily reset logic in the backend [DONE]

- Nutrient Suggestion
  - Mile 1
    - place inside the daily tracking [DONE]
    - request to spoonacular api for recipe [DONE]
    - display to interface [DONE]
  - Mile 2
    - insert add meal button to add the recipe [DONE]
    - save to backend [DONE]
    - display status [DONE] 


**Decision**: In this phase, I lay out the to do list, starting from the first feature. I do not write the list for every feature until the
end. This is because there may be changes and updated to the interface, requirements, and technologies to use. However, the main
guideline should not deviate too much from the core agreed functionality

**Code Design**: I structure the project into routers, controllers, and models, because that fits the requirement and best practices in building
a web app. We certainly need a router to handle the endpoints between the front end and back end. Next, I thought of the functionality. I understand
that our features are mainly divided into 2, database operations and external api operations. The routes are divided like this, and hence, the
controllers are too. The controllers ensure a unified place to make functions that the router uses. Initially, I only planned to have a user and
meal class. However, as I said before, as we go, we understand more about the requirements and needs. It is difficult and not good use of time
to think all about it in the beginning, because we don't know thoroughly all cases. That is why then, I added a new class which is day. This
is useful to centralize information about each day which is essential for history section in particular. The model which is mongoose, helps to enforce
that the data we have in the database are unified. This minimised errors when using database operations and sending it to the front end. We also
utilize typescripts ability to create type, to enforce certain objects to be a certain type, so that we can minimize errors.   



**Attribution**: Attribution to Nutritionix API for the freeform language parsing and Spoonacular for the meal suggestion api.

### Testing

**Decision**: In this phase, I check for bugs and feature errors. 


### Usage Guideline

Setup instructions live in the [README](README.md) and are the ones to follow. At the time of
this document they were: clone the repository, start a local MongoDB on 127.0.0.1:27017, run
App.js, and open localhost:8080. The project has since been containerised and now reads its
API credentials from the environment, so the README supersedes what is written here.

_note_: I decided not to use firebase, because after deeper research, firebase doesn't have native support for mongodb. Its
documentation also seems to separate front and back end, and researching further is limited by the time constraint I have. Hence,
I decide to stick to the deployment method of the code from github.


