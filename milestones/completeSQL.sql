DROP TABLE vote CASCADE CONSTRAINTS;
DROP TABLE joinsCommunity CASCADE CONSTRAINTS;
DROP TABLE follows CASCADE CONSTRAINTS;
DROP TABLE givenToBy CASCADE CONSTRAINTS;
DROP TABLE messageSentByIn CASCADE CONSTRAINTS;
DROP TABLE joinsChatRoom CASCADE CONSTRAINTS;
DROP TABLE chatRoom CASCADE CONSTRAINTS;
DROP TABLE commentOn CASCADE CONSTRAINTS;
DROP TABLE postIn CASCADE CONSTRAINTS;
DROP TABLE entryCreatedBy CASCADE CONSTRAINTS;
DROP TABLE communities CASCADE CONSTRAINTS;
DROP TABLE users CASCADE CONSTRAINTS;
DROP TABLE award CASCADE CONSTRAINTS;
DROP TABLE USERSAGE CASCADE CONSTRAINTS;
DROP TABLE IMAGECONTAINEDBY CASCADE CONSTRAINTS;
DROP TABLE VIDEOCONTAINEDBY CASCADE CONSTRAINTS;

CREATE TABLE UsersAge(
	dateJoined DATE	PRIMARY KEY,
	age INTEGER
);

CREATE TABLE Users (
	username	VARCHAR(50) 	PRIMARY KEY,
	email	VARCHAR(50)	NOT NULL,
	displayName	VARCHAR(50),
	dateJoined	DATE	NOT NULL,
	FOREIGN KEY (dateJoined) REFERENCES UsersAge(dateJoined) ON DELETE CASCADE,
	UNIQUE (email)
);

CREATE TABLE Communities (
	communityName	VARCHAR(50)	PRIMARY KEY,
	rule	LONG,
	description	VARCHAR(1000)	
);

CREATE TABLE EntryCreatedBy(
	entryID NUMBER GENERATED AS IDENTITY PRIMARY KEY, 
	dateCreated	DATE,
	content	LONG,
	username VARCHAR(50),
	FOREIGN KEY (username) REFERENCES Users(username)	ON DELETE CASCADE
);

CREATE TABLE PostIn (
	entryID	INTEGER	PRIMARY KEY,
	title	VARCHAR(1000)	NOT NULL,
	communityName	VARCHAR(50)	NOT NULL,
	FOREIGN KEY (entryID) REFERENCES EntryCreatedBy(entryID) ON DELETE CASCADE,
	FOREIGN KEY (communityName) REFERENCES Communities(communityName) ON DELETE CASCADE
);

CREATE TABLE CommentOn (
	entryID	INTEGER	PRIMARY KEY,
	onEntryID	INTEGER	NOT NULL,
	FOREIGN KEY (onEntryID) REFERENCES EntryCreatedBy(entryID) ON DELETE CASCADE,
	FOREIGN KEY (entryID) REFERENCES EntryCreatedBy(entryID) ON DELETE CASCADE
);
 
CREATE TABLE Chatroom (
	chatroomID	INTEGER	PRIMARY KEY,
	name	VARCHAR(50)
);

CREATE TABLE MessageSentByIn (
	messageID	INTEGER	PRIMARY KEY,
	dateSent	DATE	NOT NULL,
	content	LONG	NOT NULL,
	username	VARCHAR(50)	NOT NULL,
	chatroomID	INTEGER	NOT NULL,
	FOREIGN KEY (chatroomID) REFERENCES Chatroom(chatroomID) ON DELETE CASCADE,
	FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE	
);

CREATE TABLE JoinsChatroom (
	chatroomID	INTEGER,
	username	VARCHAR(50),
	PRIMARY KEY (chatroomID, username),
	FOREIGN KEY (chatroomID) REFERENCES Chatroom(chatroomID) ON DELETE CASCADE,
	FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE
);

CREATE TABLE Award (
	awardType	VARCHAR(10)	 PRIMARY KEY,
	value	INTEGER	NOT NULL
);

CREATE TABLE GivenToBy (
	awardType	VARCHAR(10)	NOT NULL,
	username	VARCHAR(50),
	entryID	INTEGER,
	PRIMARY KEY (awardType, username, entryID),
	FOREIGN KEY (awardType) REFERENCES Award(awardType) ON DELETE CASCADE,
	FOREIGN KEY (entryID) REFERENCES EntryCreatedBy(entryID) ON DELETE CASCADE,
	FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE
);

CREATE TABLE Follows(
	followingUsername	VARCHAR(50),
	followedUsername 	VARCHAR(50),
	PRIMARY KEY (followingUsername, followedUsername),
	FOREIGN KEY (followingUsername) REFERENCES Users(username) ON DELETE CASCADE,
	FOREIGN KEY (followedUsername) REFERENCES Users(username) ON DELETE CASCADE
);

CREATE TABLE Vote (
	username	VARCHAR(50),
	entryID	INTEGER,
	upvoteOrDownvote	INTEGER,
	PRIMARY KEY(username, entryID),
	FOREIGN KEY (entryID) REFERENCES EntryCreatedBy(entryID) ON DELETE CASCADE,
	FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE
);

CREATE TABLE JoinsCommunity(
	username	VARCHAR(50),
	communityName	VARCHAR(50),
	PRIMARY KEY (username, communityName),
	FOREIGN KEY (communityName) REFERENCES Communities(CommunityName) ON DELETE CASCADE,
	FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE
);
 
CREATE TABLE ImageContainedBy(
	AttachmentID	INTEGER 	PRIMARY KEY,
	width INTEGER,
	height INTEGER,
	imgSize FLOAT,
	imageFile	LONG RAW	NOT NULL,
	entryID	INTEGER,
	messageID	INTEGER,
	FOREIGN KEY (entryID) REFERENCES PostIn(entryID) ON DELETE CASCADE,
	FOREIGN KEY (messageID) REFERENCES MessageSentByIn(messageID) ON DELETE CASCADE
);

CREATE TABLE VideoContainedBy(
	attachmentID	INTEGER 	PRIMARY KEY,
	width INTEGER,
	height INTEGER,
	vidSize FLOAT,
	duration INTERVAL DAY TO SECOND,
	videoFile	LONG RAW	NOT NULL,
	entryID	INTEGER,
	messageID	INTEGER,
	FOREIGN KEY (entryID) REFERENCES PostIn(entryID) ON DELETE CASCADE,
	FOREIGN KEY (messageID) REFERENCES MessageSentByIn(messageID) ON DELETE CASCADE
);

INSERT INTO USERSAGE(dateJoined, age) VALUES
(TO_DATE('2024-10-16', 'YYYY-MM-DD'), 0);
INSERT INTO USERSAGE(dateJoined, age) VALUES
(TO_DATE('2024-10-15', 'YYYY-MM-DD'), 0);
INSERT INTO USERSAGE(dateJoined, age) VALUES
(TO_DATE('2024-10-14', 'YYYY-MM-DD'), 0);
INSERT INTO USERSAGE(dateJoined, age) VALUES
(TO_DATE('2024-10-13', 'YYYY-MM-DD'), 0);
INSERT INTO USERSAGE(dateJoined, age) VALUES
(TO_DATE('2023-10-12', 'YYYY-MM-DD'), 1);
INSERT INTO USERSAGE(dateJoined, age) VALUES
(TO_DATE('2012-01-02', 'YYYY-MM-DD'), 12);


INSERT INTO USERS (USERNAME, EMAIL, DATEJOINED, DISPLAYNAME) VALUES 
    ('hpoe01', 'hpoe@outlook.com', TO_DATE('2024-10-16', 'YYYY-MM-DD'), 'hansel');
INSERT INTO USERS (USERNAME, EMAIL, DATEJOINED, DISPLAYNAME) VALUES
    ('jpat02', 'jpat@outlook.com', TO_DATE('2024-10-15', 'YYYY-MM-DD'), 'jessica');
INSERT INTO USERS (USERNAME, EMAIL, DATEJOINED, DISPLAYNAME) VALUES
    ('jkim03', 'jkim@gmail.com', TO_DATE('2024-10-14', 'YYYY-MM-DD'), 'jeff');
INSERT INTO USERS (USERNAME, EMAIL, DATEJOINED, DISPLAYNAME) VALUES
    ('skat04', 'kat@gmail.com', TO_DATE('2024-10-13', 'YYYY-MM-DD'), 'kat');
INSERT INTO USERS (USERNAME, EMAIL, DATEJOINED, DISPLAYNAME) VALUES 
    ('ljon05', 'jon@gmail.com', TO_DATE('2023-10-12', 'YYYY-MM-DD'), 'jon');
INSERT INTO USERS (USERNAME, EMAIL, DATEJOINED, DISPLAYNAME) VALUES
    ('BillyBobJoe', 'bbj@gmail.com', TO_DATE('2012-01-02', 'YYYY-MM-DD'), 'IAmBBJ');


INSERT INTO COMMUNITIES(COMMUNITYNAME, RULE, DESCRIPTION) VALUES
('BuildAPC', '1. No harrasment\n 2. No Politics...', 'Welcome to the largest sub on anything
PC related');
INSERT INTO COMMUNITIES(COMMUNITYNAME, RULE, DESCRIPTION) VALUES
('Math', '1. No discussing other subjects\n 2. No Physics discussion...' , 'Discuss anything
Math here!');
INSERT INTO COMMUNITIES(COMMUNITYNAME, RULE, DESCRIPTION)
VALUES ('CSCareers', '1. No Grifting\n 2. No Politics...', 'Ask industry Professionals about CS
career');
INSERT INTO COMMUNITIES(COMMUNITYNAME, RULE, DESCRIPTION)
VALUES ('AMA', '1. No boring questions\n 2. Be original...', 'Place for interesting people to answer
questions');
INSERT INTO COMMUNITIES(COMMUNITYNAME, RULE, DESCRIPTION)
VALUES ('Gaming', '1. Gaming topics only\n 2. No Politics...', 'Discuss the latest gaming news
here!');


INSERT INTO ENTRYCREATEDBY(DATECREATED, CONTENT, USERNAME) VALUES
(TO_DATE('2024-10-15', 'YYYY-MM-DD'), 'postcontent1', 'hpoe01');
INSERT INTO ENTRYCREATEDBY(DATECREATED, CONTENT, USERNAME) VALUES
(TO_DATE('2024-10-14', 'YYYY-MM-DD'), 'postcontent2', 'hpoe01');
INSERT INTO ENTRYCREATEDBY(DATECREATED, CONTENT, USERNAME) VALUES
(TO_DATE('2024-10-13', 'YYYY-MM-DD'), 'postcontent3', 'jpat02');
INSERT INTO ENTRYCREATEDBY(DATECREATED, CONTENT, USERNAME) VALUES
(TO_DATE('2024-10-12', 'YYYY-MM-DD'), 'postcontent4', 'skat04');
INSERT INTO ENTRYCREATEDBY(DATECREATED, CONTENT, USERNAME) VALUES
(TO_DATE('2024-10-11', 'YYYY-MM-DD'), 'postcontent5', 'ljon05');


INSERT INTO ENTRYCREATEDBY(DATECREATED, CONTENT, USERNAME) VALUES
(TO_DATE('2024-10-15', 'YYYY-MM-DD'), 'commentcontent1', 'hpoe01');
INSERT INTO ENTRYCREATEDBY(DATECREATED, CONTENT, USERNAME) VALUES
(TO_DATE('2024-10-14', 'YYYY-MM-DD'), 'commentcontent2', 'hpoe01');
INSERT INTO ENTRYCREATEDBY(DATECREATED, CONTENT, USERNAME) VALUES
(TO_DATE('2024-10-13', 'YYYY-MM-DD'), 'commentcontent3', 'jpat02');
INSERT INTO ENTRYCREATEDBY(DATECREATED, CONTENT, USERNAME) VALUES
(TO_DATE('2024-10-12', 'YYYY-MM-DD'), 'commentcontent4', 'skat04');
INSERT INTO ENTRYCREATEDBY(DATECREATED, CONTENT, USERNAME) VALUES
(TO_DATE('2024-10-11', 'YYYY-MM-DD'), 'commentcontent5', 'ljon05');


INSERT INTO PostIn(ENTRYID, TITLE, COMMUNITYNAME) VALUES
(1,'New Fallout Game',  'Gaming');
INSERT INTO PostIn(ENTRYID, TITLE, COMMUNITYNAME) VALUES
(2,'Stuck in this level', 'Gaming');
INSERT INTO PostIn(ENTRYID, TITLE, COMMUNITYNAME) VALUES
(3,'How to get a job?',  'CSCareers');
INSERT INTO PostIn(ENTRYID, TITLE, COMMUNITYNAME) VALUES
(4,'Stuck in this level', 'Gaming');
INSERT INTO PostIn(ENTRYID, TITLE, COMMUNITYNAME) VALUES
(5,'CPU Overheating?',  'BuildAPC');


INSERT INTO CommentOn(ENTRYID, ONENTRYID) VALUES
(6, 1);
INSERT INTO CommentOn(ENTRYID, ONENTRYID) VALUES
(7, 2);
INSERT INTO CommentOn(ENTRYID, ONENTRYID) VALUES
(8, 3);
INSERT INTO CommentOn(ENTRYID, ONENTRYID) VALUES
(9, 4);
INSERT INTO CommentOn(ENTRYID, ONENTRYID) VALUES
(10, 5);


INSERT INTO CHATROOM(CHATROOMID, NAME) VALUES
(1, 'General');
INSERT INTO CHATROOM(CHATROOMID, NAME) VALUES
(2, '304 Project');
INSERT INTO CHATROOM(CHATROOMID, NAME) VALUES
(3, 'aaa');
INSERT INTO CHATROOM(CHATROOMID, NAME) VALUES
(4, 'bbb');
INSERT INTO CHATROOM(CHATROOMID, NAME) VALUES
(5, 'ccc');


INSERT INTO MessageSentByIn(messageID, dateSent, content, username, chatroomID) VALUES
(1, TO_DATE('2024-10-12', 'YYYY-MM-DD'), 'hello', 'hpoe01', 2);
INSERT INTO MessageSentByIn(messageID, dateSent, content, username, chatroomID) VALUES
(2, TO_DATE('2024-10-12', 'YYYY-MM-DD'), 'any progress on the project', 'hpoe01', 2);
INSERT INTO MessageSentByIn(messageID, dateSent, content, username, chatroomID) VALUES
(3, TO_DATE('2024-10-12', 'YYYY-MM-DD'), 'yea i pulled an all nighter', 'jpat02', 2);
INSERT INTO MessageSentByIn(messageID, dateSent, content, username, chatroomID) VALUES
(4, TO_DATE('2024-10-12', 'YYYY-MM-DD'), 'i just pushed my code', 'jkim03', 2);
INSERT INTO MessageSentByIn(messageID, dateSent, content, username, chatroomID) VALUES
(5, TO_DATE('2024-10-12', 'YYYY-MM-DD'), 'sounds good, im almost done as well', 'hpoe01', 2);


INSERT INTO JoinsChatroom(chatroomID, username) VALUES
(2, 'hpoe01');
INSERT INTO JoinsChatroom(chatroomID, username) VALUES
(2, 'jpat02');
INSERT INTO JoinsChatroom(chatroomID, username) VALUES
(2, 'jkim03');
INSERT INTO JoinsChatroom(chatroomID, username) VALUES
(1, 'hpoe01');
INSERT INTO JoinsChatroom(chatroomID, username) VALUES
(4, 'jpat02');



INSERT INTO AWARD(AWARDTYPE, VALUE) VALUES
('Gold', 100);
INSERT INTO AWARD(AWARDTYPE, VALUE) VALUES
('Silver', 75);
INSERT INTO AWARD(AWARDTYPE, VALUE) VALUES
('Bronze', 50);
INSERT INTO AWARD(AWARDTYPE, VALUE) VALUES
('Rose', 25);
INSERT INTO AWARD(AWARDTYPE, VALUE) VALUES
('Balloon', 10);
INSERT INTO AWARD(AWARDTYPE, VALUE) VALUES
('Heart', 10);



INSERT INTO GIVENTOBY(AWARDTYPE, USERNAME, ENTRYID) VALUES
('Gold', 'hpoe01', 1);
INSERT INTO GIVENTOBY(AWARDTYPE, USERNAME, ENTRYID) VALUES
('Silver', 'hpoe01', 2);
INSERT INTO GIVENTOBY(AWARDTYPE, USERNAME, ENTRYID) VALUES
('Gold', 'hpoe01', 3);
INSERT INTO GIVENTOBY(AWARDTYPE, USERNAME, ENTRYID) VALUES
('Gold', 'hpoe01', 4);
INSERT INTO GIVENTOBY(AWARDTYPE, USERNAME, ENTRYID) VALUES
('Gold', 'hpoe01', 5);
INSERT INTO GIVENTOBY(AWARDTYPE, USERNAME, ENTRYID) VALUES
('Balloon', 'jpat02', 5);


INSERT INTO FOLLOWS(followingUsername, followedUsername) VALUES
('hpoe01', 'jpat02');
INSERT INTO FOLLOWS(followingUsername, followedUsername) VALUES
('jpat02', 'hpoe01');
INSERT INTO FOLLOWS(followingUsername, followedUsername) VALUES
('skat04', 'hpoe01');
INSERT INTO FOLLOWS(followingUsername, followedUsername) VALUES
('hpoe01', 'skat04');
INSERT INTO FOLLOWS(followingUsername, followedUsername) VALUES
('skat04', 'ljon05');


INSERT INTO VOTE(username, entryID, upvoteorDownvote) VALUES
('jpat02', 1, 1);
INSERT INTO VOTE(username, entryID, upvoteorDownvote) VALUES
('jpat02', 2, 1);
INSERT INTO VOTE(username, entryID, upvoteorDownvote) VALUES
('hpoe01', 3, 1);
INSERT INTO VOTE(username, entryID, upvoteorDownvote) VALUES
('hpoe01', 4, 1);
INSERT INTO VOTE(username, entryID, upvoteorDownvote) VALUES
('skat04', 5, 1);


INSERT INTO JOINSCOMMUNITY(USERNAME, COMMUNITYNAME) VALUES
('hpoe01', 'Gaming');
INSERT INTO JOINSCOMMUNITY(USERNAME, COMMUNITYNAME) VALUES
('hpoe01', 'BuildAPC');
INSERT INTO JOINSCOMMUNITY(USERNAME, COMMUNITYNAME) VALUES
('hpoe01', 'CSCareers');
INSERT INTO JOINSCOMMUNITY(USERNAME, COMMUNITYNAME) VALUES
('hpoe01', 'Math');
INSERT INTO JOINSCOMMUNITY(USERNAME, COMMUNITYNAME) VALUES
('hpoe01', 'AMA');

INSERT INTO JOINSCOMMUNITY(USERNAME, COMMUNITYNAME) VALUES
('jpat02', 'CSCareers');
INSERT INTO JOINSCOMMUNITY(USERNAME, COMMUNITYNAME) VALUES
('skat04', 'Gaming');
INSERT INTO JOINSCOMMUNITY(USERNAME, COMMUNITYNAME) VALUES
('ljon05', 'BuildAPC');


INSERT INTO IMAGECONTAINEDBY(AttachmentID, width, height, imgSize, imageFile, entryID, messageID) VALUES
(1, 270, 420, 2.4, HEXTORAW('0A'), 1, 2);
INSERT INTO IMAGECONTAINEDBY(AttachmentID, width, height, imgSize, imageFile, entryID, messageID) VALUES
(2, 270, 420, 2.4, HEXTORAW('0A'), 1, 2);
INSERT INTO IMAGECONTAINEDBY(AttachmentID, width, height, imgSize, imageFile, entryID, messageID) VALUES
(3, 270, 420, 2.4, HEXTORAW('0A'), 1, 2);
INSERT INTO IMAGECONTAINEDBY(AttachmentID, width, height, imgSize, imageFile, entryID, messageID) VALUES
(4, 270, 420, 2.4, HEXTORAW('0A'), 1, 2);
INSERT INTO IMAGECONTAINEDBY(AttachmentID, width, height, imgSize, imageFile, entryID, messageID) VALUES
(5, 270, 420, 2.4, HEXTORAW('0A'), 1, 2);


INSERT INTO VIDEOCONTAINEDBY(AttachmentID, width, height, vidSize, duration, videoFile, entryID, messageID) VALUES
(1, 270, 420, 6.4, INTERVAL '0 00:01:45' DAY TO SECOND, HEXTORAW('0A'), 1, 2);
INSERT INTO VIDEOCONTAINEDBY(AttachmentID, width, height, vidSize, duration, videoFile, entryID, messageID) VALUES
(2, 270, 720, 4.5, INTERVAL '0 00:01:02' DAY TO SECOND, HEXTORAW('0A'), 1, 2);
INSERT INTO VIDEOCONTAINEDBY(AttachmentID, width, height, vidSize, duration, videoFile, entryID, messageID) VALUES
(3, 870, 421, 11.1, INTERVAL '0 00:00:45' DAY TO SECOND, HEXTORAW('0A'), 1, 2);
INSERT INTO VIDEOCONTAINEDBY(AttachmentID, width, height, vidSize, duration, videoFile, entryID, messageID) VALUES
(4, 240, 443, 2.3, INTERVAL '0 00:00:43' DAY TO SECOND, HEXTORAW('0A'), 1, 2);
INSERT INTO VIDEOCONTAINEDBY(AttachmentID, width, height, vidSize, duration, videoFile, entryID, messageID) VALUES
(5, 570, 420, 7.4, INTERVAL '0 00:05:25' DAY TO SECOND, HEXTORAW('0A'), 1, 2);
