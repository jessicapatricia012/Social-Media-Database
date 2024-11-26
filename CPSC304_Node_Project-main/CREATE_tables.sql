
CREATE TABLE Users (
	username	VARCHAR(50) 	PRIMARY KEY,
	email	VARCHAR(50)	NOT NULL,
	displayName	VARCHAR(50),
	dateJoined	DATE	NOT NULL,
	UNIQUE (email)
);

CREATE TABLE UsersAge(
	dateJoined DATE	PRIMARY KEY,
	age INTEGER	NOT NULL
);

CREATE TABLE Communities (
	communityName	VARCHAR(50)	PRIMARY KEY,
	rule	LONG,
	description	VARCHAR(1000)	
);

CREATE TABLE EntryCreatedBy(
	entryID INTEGER PRIMARY KEY, 
	dateCreated	DATE,
	content	LONG,
	username VARCHAR(50) REFERENCES Users(username)		
);

CREATE TABLE PostIn (
	entryID	INTEGER	PRIMARY KEY,
	title	VARCHAR(1000)	NOT NULL,
	communityName	VARCHAR(50)	NOT NULL,
	FOREIGN KEY (entryID) REFERENCES EntryCreatedBy(entryID),
	FOREIGN KEY (communityName) REFERENCES Communities(communityName)
);

CREATE TABLE CommentOn (
	entryID	INTEGER	PRIMARY KEY,
	onEntryID	INTEGER	NOT NULL,
	FOREIGN KEY (onEntryID) REFERENCES EntryCreatedBy(entryID),
	FOREIGN KEY (entryID) REFERENCES EntryCreatedBy(entryID)
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
	FOREIGN KEY (chatroomID) REFERENCES Chatroom(chatroomID),
	FOREIGN KEY (username) REFERENCES Users(username)	
);

CREATE TABLE JoinsChatroom (
	chatroomID	INTEGER,
	username	VARCHAR(50),
	PRIMARY KEY (chatroomID, username),
	FOREIGN KEY (chatroomID) REFERENCES Chatroom(chatroomID),
	FOREIGN KEY (username) REFERENCES Users(username)
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
	FOREIGN KEY (awardType) REFERENCES Award(awardType),
	FOREIGN KEY (entryID) REFERENCES EntryCreatedBy(entryID),
	FOREIGN KEY (username) REFERENCES Users(username)
);

CREATE TABLE Follows(
	followingUsername	VARCHAR(50),
	followedUsername 	VARCHAR(50),
	PRIMARY KEY (followingUsername, followedUsername),
	FOREIGN KEY (followingUsername) REFERENCES Users(username),
	FOREIGN KEY (followedUsername) REFERENCES Users(username)
);

CREATE TABLE Vote (
	username	VARCHAR(50),
	entryID	INTEGER,
	upvoteOrDownvote	INTEGER,
	PRIMARY KEY(username, entryID),
	FOREIGN KEY (entryID) REFERENCES EntryCreatedBy(entryID),
	FOREIGN KEY (username) REFERENCES Users(username)
);

CREATE TABLE JoinsCommunity(
	username	VARCHAR(50),
	communityName	VARCHAR(50),
	PRIMARY KEY (username, communityName),
	FOREIGN KEY (communityName) REFERENCES Communities(CommunityName),
	FOREIGN KEY (username) REFERENCES Users(username)
);
 
CREATE TABLE ImageContainedBy(
	AttachmentID	INTEGER 	PRIMARY KEY,
	imageFile	LONG RAW	NOT NULL,
	entryID	INTEGER,
	messageID	INTEGER,
	FOREIGN KEY (entryID) REFERENCES PostIn(entryID),
	FOREIGN KEY (messageID) REFERENCES MessageSentByIn(messageID)
);

CREATE TABLE VideoContainedBy(
	attachmentID	INTEGER 	PRIMARY KEY,
	videoFile	LONG RAW	NOT NULL,
	entryID	INTEGER,
	messageID	INTEGER,
	FOREIGN KEY (entryID) REFERENCES PostIn(entryID),
	FOREIGN KEY (messageID) REFERENCES MessageSentByIn(messageID)
);




