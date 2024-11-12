CREATE TABLE User (
	username	VARCHAR(20) 	PRIMARY KEY,
	email	VARCHAR(20)	NOT NULL,
	dateJoined	DATE	NOT NULL,
	displayName	VARCHAR(20),
	UNIQUE (email)
);
CREATE TABLE Community (
	communityName	VARCHAR(20)	PRIMARY KEY,
	rule	TEXT,
	description	TEXT		
);
CREATE TABLE EntryCreatedBy (
	entryID	INTEGER	PRIMARY KEY,
	dateCreated	DATE,
	content	TEXT,
	username	VARCHAR(20)		
);
CREATE TABLE PostIn (
	entryID	INTEGER	PRIMARY KEY,
	title	TEXT	NOT NULL,
	communityName	VARCHAR(20)	NOT NULL,
	FOREIGN KEY (communityName) REFERENCES EntryCreatedByIn,
	FOREIGN KEY (communityName) REFERENCES Community,
);
CREATE TABLE CommentOn (
	entryID	INETEGER	PRIMARY KEY,
	onEntryID	INTEGER	NOT NULL,
	FOREIGN KEY (onEntryID) REFERENCES EntryCreatedByIn,
	FOREIGN KEY (entryID) REFERENCES EntryCreatedByIn
);
 
CREATE TABLE MessageSentByIn (
	messageID	INETEGER	PRIMARY KEY,
	dateSent	DATE	NOT NULL,
	content	TEXT	NOT NULL,
	username	VARCHAR(20)	NOT NULL,
	chatroomID	INETEGER	NOT NULL,
	FOREIGN KEY (chatroomID) REFERENCES chatRoom,
	FOREIGN KEY (username) REFERENCES User	
);
CREATE TABLE ChatRoom (
	chatroomID	INTEGER	PRIMARY KEY,
	name	VARCHAR(20)
);
CREATE TABLE JoinsChatRoom (
	chatroomID	INTEGER,
	username	VARCHAR(20),
	PRIMARY KEY (chatroomID, username),
	FOREIGN KEY (chatroomID) REFERENCES chatRoom,
	FOREIGN KEY (username) REFERENCES User,
);
CREATE TABLE Award (
	awardType	VARCHAR(10)	 PRIMARY KEY,
	value	INTEGER	NOT NULL
);
CREATE TABLE GivenToBy (
	awardType	INETEGER	NOT NULL,
	username	VARCHAR(20),
	entryID	INETEGER,
	PRIMARY KEY (awardType, username, entryID),
	FOREIGN KEY (awardType) REFERENCES award,
	FOREIGN KEY (entryID) REFERENCES EntryCreatedBy,
	FOREIGN KEY (username) REFERENCES User,
);
 
CREATE TABLE Follows(
	followingUsername	VARCHAR(20),
	followedUsername 	VARCHAR(20)
	PRIMARY KEY(followingUsername, followedUsername),
	FOREIGN KEY (followingUsername) REFERENCES User,
	FOREIGN KEY (followedUsername) REFERENCES User,
);

CREATE TABLE Vote (
	username	VARCHAR(20),
	entryID	INTEGER,
	upvoteOrDownvote	BOOLEAN,
	PRIMARY KEY(username, entryID),
	FOREIGN KEY (entryID) REFERENCES EntryCreatedBy,
	FOREIGN KEY (username) REFERENCES User,
);

CREATE TABLE JoinsCommunity(
	username	VARCHAR(20),
	communityName	VARCHAR(20),
	PRIMARY KEY (username, communityName),
	FOREIGN KEY (communityName) REFERENCES Community,
	FOREIGN KEY (username) REFERENCES User,
);
CREATE TABLE ImageContainedBy1(
	imageFile	MEDIUMBLOB 	PRIMARY KEY,
	width	INTEGER
);
CREATE TABLE ImageContainedBy3(
	imageFile	MEDIUMBLOB 	PRIMARY KEY,
	height	INTEGER
);
CREATE TABLE ImageContainedBy5(
	imageFile	MEDIUMBLOB 	PRIMARY KEY,
	size	INTEGER
);
 
CREATE TABLE ImageContainedBy6(
	AttachmentID	INTEGER 	PRIMARY KEY,
	imageFile	MEDIUMBLOB	NOT NULL,
	entryID	INTEGER,
	messageID	INETEGER,
	FOREIGN KEY (entryID) REFERENCES PostIn,
	FOREIGN KEY (messageID) REFERENCED MessageSentByIn
);
CREATE TABLE VideoContainedBy1 (
	videoFile	LARGEBLOB 	PRIMARY KEY,
	width	INTEGER
);
CREATE TABLE VideoContainedBy3 (
	videoFile	LARGEBLOB 	PRIMARY KEY,
	height	INTEGER
);
CREATE TABLE VideoContainedBy5 (
	videoFile	LARGEBLOB 	PRIMARY KEY,
	size	INTEGER
);
CREATE TABLE VideoContainedBy7 (
	videoFile	LARGEBLOB 	PRIMARY KEY,
	duration	TIME
);
CREATE TABLE VideoContainedBy8(
	attachmentID	INTEGER 	PRIMARY KEY,
	videoFile	LARGEBLOB	NOT NULL,
	entryID	INTEGER,
	messageID	INETEGER,
	FOREIGN KEY (entryID) REFERENCES PostIn,
	FOREIGN KEY (messageID) REFERENCED MessageSentByIn
);




