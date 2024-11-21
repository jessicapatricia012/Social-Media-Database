CREATE TABLE users ( 
 username VARCHAR(20)  PRIMARY KEY, 
 email VARCHAR(20) NOT NULL, 
 dateJoined DATE NOT NULL, 
 displayName VARCHAR(20), 
 UNIQUE (email) 
); 

CREATE TABLE communities ( 
 communityName VARCHAR(20) PRIMARY KEY, 
 rule TEXT, 
 description TEXT   
); 

CREATE TABLE entryCreatedBy ( 
 entryID INTEGER PRIMARY KEY, 
 dateCreated DATE, 
 content TEXT, 
 username VARCHAR(20)   
); 

CREATE TABLE postIn ( 
 entryID INTEGER PRIMARY KEY, 
 title TEXT NOT NULL, 
 communityName VARCHAR(20) NOT NULL, 
 FOREIGN KEY (communityName) REFERENCES EntryCreatedByIn, 
 FOREIGN KEY (communityName) REFERENCES Community, 
); 

CREATE TABLE commentOn ( 
 entryID INTEGER PRIMARY KEY,
 onEntryID INTEGER NOT NULL, 
 FOREIGN KEY (onEntryID) REFERENCES EntryCreatedByIn, 
 FOREIGN KEY (entryID) REFERENCES EntryCreatedByIn 
); 
    
CREATE TABLE messageSentByIn ( 
 messageID INTEGER PRIMARY KEY,
 dateSent DATE NOT NULL, 
 content TEXT NOT NULL, 
 username VARCHAR(20) NOT NULL, 
 chatroomID INETEGER NOT NULL, 
 FOREIGN KEY (chatroomID) REFERENCES chatRoom, 
 FOREIGN KEY (username) REFERENCES User   
); 

CREATE TABLE chatRoom ( 
 chatroomID INTEGER PRIMARY KEY, 
 name VARCHAR(20) 
); 

CREATE TABLE joinsChatRoom ( 
 chatroomID INTEGER, 
 username VARCHAR(20), 
 PRIMARY KEY (chatroomID, username), 
 FOREIGN KEY (chatroomID) REFERENCES chatRoom, 
 FOREIGN KEY (username) REFERENCES User, 
); 

CREATE TABLE awards ( 
 awardType VARCHAR(10)  PRIMARY KEY, 
 value INTEGER NOT NULL 
); 

CREATE TABLE givenToBy ( 
 awardType INETEGER NOT NULL, 
 username VARCHAR(20), 
 entryID INETEGER, 
 PRIMARY KEY (awardType, username, entryID), 
 FOREIGN KEY (awardType) REFERENCES award, 
 FOREIGN KEY (entryID) REFERENCES EntryCreatedBy, 
 FOREIGN KEY (username) REFERENCES User, 
); 
   
CREATE TABLE follows( 
 followingUsername  VARCHAR(20), 
 followedUsername   VARCHAR(20) 
 PRIMARY KEY(followingUsername, followedUsername), 
 FOREIGN KEY (followingUsername) REFERENCES User, 
 FOREIGN KEY (followedUsername) REFERENCES User, 
); 
 
CREATE TABLE vote ( 
 username VARCHAR(20), 
 entryID INTEGER, 
 upvoteOrDownvote BOOLEAN, 
 PRIMARY KEY(username, entryID), 
 FOREIGN KEY (entryID) REFERENCES EntryCreatedBy, 
 FOREIGN KEY (username) REFERENCES User, 
); 
 
CREATE TABLE joinsCommunity( 
 username VARCHAR(20), 
 communityName VARCHAR(20), 
 PRIMARY KEY (username, communityName), 
 FOREIGN KEY (communityName) REFERENCES Community, 
 FOREIGN KEY (username) REFERENCES User, 
); 

CREATE TABLE imageContainedBy1( 
 imageFile MEDIUMBLOB  PRIMARY KEY, 
 width INTEGER 
); 

CREATE TABLE imageContainedBy3( 
 imageFile MEDIUMBLOB  PRIMARY KEY, 
 height INTEGER 
); 

CREATE TABLE imageContainedBy5( 
 imageFile MEDIUMBLOB  PRIMARY KEY, 
 size INTEGER 
); 
   
CREATE TABLE imageContainedBy6( 
 AttachmentID INTEGER  PRIMARY KEY, 
 imageFile MEDIUMBLOB NOT NULL, 
 entryID INTEGER, 
 messageID INETEGER, 
 FOREIGN KEY (entryID) REFERENCES PostIn, 
 FOREIGN KEY (messageID) REFERENCES MessageSentByIn
); 

CREATE TABLE videoContainedBy1 ( 
 videoFile LARGEBLOB  PRIMARY KEY, 
 width INTEGER 
); 

CREATE TABLE videoContainedBy3 ( 
 videoFile LARGEBLOB  PRIMARY KEY, 
 height INTEGER 
); 

CREATE TABLE videoContainedBy5 ( 
 videoFile LARGEBLOB  PRIMARY KEY, 
 size INTEGER 
); 

CREATE TABLE videoContainedBy7 ( 
 videoFile LARGEBLOB  PRIMARY KEY, 
 duration TIME 
); 

CREATE TABLE videoContainedBy8( 
 attachmentID INTEGER  PRIMARY KEY, 
 videoFile LARGEBLOB NOT NULL, 
 entryID INTEGER, 
 messageID INETEGER, 
 FOREIGN KEY (entryID) REFERENCES PostIn, 
 FOREIGN KEY (messageID) REFERENCES MessageSentByIn
);