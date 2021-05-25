# THE QCFirst2.0 Web Application

## Contents
* [Contents](#contents)
* [Live Link](#live-link)
* [Contributors](#contributors)
* [Description](#description)
* [Technical Specification](#technical-specification)
* [Important Features](#important-features)
* [User Interface](#user-interface)
* [Version History](#version-history)
* [Summary](#summary)

## Live Link
Please Click the Live link Below to Be Transported to QCFirst2.0.<br>
#### CLICK [here](http://localhost:3000/)

## Contributors
<u>**Team Member 1**</u> David Acuqui: Played a major role in the overall design, and re-design of QCFirst into QCFIRST 2.0. David not only served in the capacity as a project manager, but as well as the technical back-end lead. His technical subject matter expertise allowed him to delegate tasks, and push out delieverables in a timely manner. He was responsible for the original design of QCFirst, the re-design of QCFirst, the implementation of the *web application stack* that was used in building QCFirst. David handled much of the database integration, as well as building the skeleteon of QCFirst and served in the capacity as senior-developer. David is continuing to work, finalize the authentication process that was begun but unable to be completed by Jonathan. In addition he provided invaluable subject matter expertise in the layout, creation, deployement and critical analysis of the QCFirst. Contributions include: majority of the front-end, back-end, and database.<br>

<u>**Team Member 2**</u> Jonathan Yulan: Played a major role in beginning authentication process, as well as handeling the written delieverables that were needed for the inception of QCFirst. His research was necessary in developing the necessary technologies that were used to get QCFirst were it needed to be. He followed and handled all tasks that were given to him by the tech-leader, David. He played a key role in the testing of the site, and ensured that the necessary criteria of QCFirst was addressed in the creation of the website. Jonathan troubleshooted the authentication process, the login-process and created the view structure as well as aided in building skeleteon of the website, and served in the capacity as a junior-developer. Contributions include: signup page, login page, validation for both pages, and this readMe<br>

### Description 
The **QCFirst** web application was designed with the user in mind. Many universities over burden their web applications, make finding pertinent information more difficult to find than gold, have an unresponsive design that limits the user to their desktop and are using outdated technologies that make it impossible for the web application to scale and update when new features are available. The **QCFirst** was designed and created to ensure that all the former complaints are nothing more than an after thought. **QCFirst** was created to be responsive on all devices, to ensure that the user has the capability to perform database-centric tasks on the site itself, and utilizes sophisticated frameworks/tools to give the web application powerful functionality. Oh, and the site is not only for students, it was built to support teachers as well as students. 

## Technical Specifications 
The **QCFirst** was designed with the following *stack*;<br>
 *1)* **MongoDB** a cross-platform document oriented database which gives the website to ability to: Ad-hoc queries, store files, allow for server-side query execution, and comes readily available with a list of server-side JavaScript technologies. <br>
 *2)* **Node.js** is an open source, cross-platform back-end JavaScript runtime environemnt. It helps in running scripts server-side to produce the beautiful, dynamic web pages that **QCFirst** has to offer. It is widely used in web development, due to its ability to unify web-applications and its collection of modules taht handle various core functionalities. <br>
 *3)* **Express.js** a back end web application framework that was designed for building sophisticated web applications. Express is a framework that runs within **Node.js** that provides the means for a developer to create and maintain robust servers. **Express.js** comes with many built-in features that give **QCFirst** better functionality, increased security and help improve query speed. <br>
 *4)* **Front End** Graphic User Interface was made aesthetic and pleasing to the user experience using the **Bootstrap** library<br>
 *5)* **Front End** was created with the following languages: *HTML*, *CSS*, and *JavaScript*.
 *6)* **Back End** is making use of the following: Passport, Mongoose, AccessControl.

## Important Features
QC First website is a one-stop shop that will allow user(s) of type: student(s), instructor(s), and admin to access their specific, database-generated information in order to achieve basic task such as: log-in via a specific page to access different functionality, lay out necessary and user-specific information pertinent to the user, adjust course schedule.<br>
User(s) will consist of two types: 1) students and 2) instructors <br>
User(s) will be able to sign up using their e-mail address, and after have specific user-related information pre-populated for their use. <br>
The Website currently does not let users take any impactful action on the QCFirst 2.0 without the first user authenticating himself. <br>
The Website has been connected to a remote-database that was populated during QCFirst 2.0's troubleshooting phase. <br>
The Website is meant to allow user(s) certain permissions designated by different roles(instructor,student) <br> 
The Website is now fully responsive on all devices due to utilization of the Bootstrap library <br>
If a user is not signed in, they are unable to take any actions, navigate the website, and may only access the home screen, the login, or signup pages. <br>
Once a user is signed in, they have access to the whole website. <br>
A user of type student is able to add or drop classes, see their schedule, and search for courses. <br>
A user of type instructor is able to see their courses, view the students in their class, create a new course, delete a course, search for courses. <br>
A user of type admin is able to see the information in the database.

## User Interface

### QCFirst 2.0 Welcome Page (user not signed in)
![Welcome-Page](https://i.imgur.com/JQB3c4g.png)

### QCFirst 2.0 Registration Page w/ Client Side Authentication
![Registration-Page](https://i.imgur.com/tc8mrqW.png)

### QCFirst 2.0 Welcome Page (user signed in)
![Welcome-Page](https://imgur.com/efzSlKJ.png)

### QCFirst 2.0 Student Side, Enrollment Center
![Student-Enrollment_Center](https://imgur.com/hEVSQpc.png)

### QCFirst 2.0 Student Side, Search Page and View Their Courses
![Student-Add_Course](https://imgur.com/gdCDIdZ.png)

### QCFirst 2.0 Student Side, Search Results
![Student-Search_Results](https://imgur.com/LPlICHJ.png)

### QCFirst 2.0 Student Side, Drop Course 
![Student-Drop_Course](https://imgur.com/O0hn0sy.png)

### QCFirst 2.0 Instructor Side, Home Page
![Teacher-Home-Page](https://imgur.com/O67lKu5.png)

### QCFirst 2.0 Instructor Side, My Courses
![Teacher-My-Courses](https://imgur.com/a9TfH9Z.png)

### QCFirst 2.0 Instructor Side, Create Course
![Teacher-Create-Course](https://imgur.com/nj04kL1.png)

### QCFirst 2.0 Instructor Side, Delete Course
![Teacher-Delete-Course](https://imgur.com/ZQblDaB.png)

### QCFirst 2.0 Instructor Side, Search Course
![Teacher-Search-Course](https://i.imgur.com/RiwpuOu.png)

### QCFirst 2.0 Instructor Side, Delete Course 
![Teacher-Delete-Course](https://i.imgur.com/dsbw2f3.png)

## Version History 
* 0.1 
	* Initial Release
* 0.2 
	* Release for Delieverable 3
* 2.0
	* Release for Delieverable 4
* 3.0 
	* Set for final deployment on May 17, 2021 

## Summary 
QCFirst 2.0 was completely re-innovated as per the feedback on delieverable 3 which was centered primarily around the front-end and the lack of responsiveness. At this time much of the back-end functionality is still not complete, albeit much of the foundational groundwork has been integrated as of QCFirst 2.0. QCFirst development team ran into issues with the user authetnication process, as well as dynamically rendering and obtaining information in real time with QCFirst 2.0. Q&A spent the majority of the last few days troubleshooting and seeking solutions/workarounds to the persistent issues we are currently having with QCFirst 2.0. QCFirst 2.0 deployment team feels strongly that with feedback, some guidance QCFirst 2.0 can hit all the necessary requirments and produce a product that not only delievers on the necessary requirments but is an overall enjoyable experience to the user.   
