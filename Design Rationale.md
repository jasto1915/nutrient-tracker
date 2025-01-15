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

**Reasoning**:


**Thought Process**: Building an app that received user input can be done through Web app, Desktop/mobile app, or just a script
and a shell for input. Certainly, the end goal which is most convenient for the user is not a shell script. However, with 
the time constraint, I plan to focus to build the back-end and logic first, with a simple terminal user input first if needed
for testing. The front-end can be developed in the later stages. In our app, there are then three main features,
nutrition measurement, nutrition tracker, nutrition suggestion, with main services such as data persistence and 
https requests. The code must handle data connections to the database, external requests to API's, input guidance...