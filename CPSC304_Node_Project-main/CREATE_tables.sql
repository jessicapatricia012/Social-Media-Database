-- clearing database
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
DROP TABLE awards CASCADE CONSTRAINTS;
DROP TABLE imageContainedBy6 CASCADE CONSTRAINTS;
DROP TABLE imageContainedBy5 CASCADE CONSTRAINTS;
DROP TABLE imageContainedBy3 CASCADE CONSTRAINTS;
DROP TABLE imageContainedBy1 CASCADE CONSTRAINTS;
DROP TABLE videoContainedBy8 CASCADE CONSTRAINTS;
DROP TABLE videoContainedBy7 CASCADE CONSTRAINTS;
DROP TABLE videoContainedBy5 CASCADE CONSTRAINTS;
DROP TABLE videoContainedBy3 CASCADE CONSTRAINTS;
DROP TABLE videoContainedBy1 CASCADE CONSTRAINTS;

-- Create tables
CREATE TABLE users
(
    username          VARCHAR2(50) PRIMARY KEY,
    email             VARCHAR2(100) NOT NULL UNIQUE,
    dateJoined        DATE          NOT NULL,
    displayName       VARCHAR2(50),
    followingUsername VARCHAR2(50),
    followedUsername  VARCHAR2(50)
);

CREATE TABLE communities
(
    communityName VARCHAR2(50) PRIMARY KEY,
    rules          VARCHAR2(1000),
    description   VARCHAR2(250)
);

CREATE TABLE entryCreatedBy
(
    entryID     INTEGER PRIMARY KEY,
    dateCreated DATE,
    content     VARCHAR2(1000),
    username    VARCHAR2(50),
    FOREIGN KEY (username) REFERENCES users (username)
);

CREATE TABLE postIn
(
    entryID       INTEGER PRIMARY KEY,
    title         VARCHAR2(100) NOT NULL,
    communityName VARCHAR2(50)  NOT NULL,
    FOREIGN KEY (communityName) REFERENCES communities (communityName),
    FOREIGN KEY (entryID) REFERENCES entryCreatedBy (entryID)
);

CREATE TABLE commentOn
(
    entryID   INTEGER PRIMARY KEY,
    onEntryID INTEGER NOT NULL,
    FOREIGN KEY (onEntryID) REFERENCES entryCreatedBy (entryID),
    FOREIGN KEY (entryID) REFERENCES entryCreatedBy (entryID)
);

CREATE TABLE chatRoom
(
    chatroomID INTEGER PRIMARY KEY,
    name       VARCHAR2(50)
);

CREATE TABLE messageSentByIn
(
    messageID  INTEGER PRIMARY KEY,
    dateSent   DATE           NOT NULL,
    content    VARCHAR2(1000) NOT NULL,
    username   VARCHAR2(50)   NOT NULL,
    chatroomID INTEGER        NOT NULL,
    FOREIGN KEY (chatroomID) REFERENCES chatRoom (chatroomID),
    FOREIGN KEY (username) REFERENCES users (username)
);

CREATE TABLE joinsChatRoom
(
    chatroomID INTEGER,
    username   VARCHAR2(50),
    PRIMARY KEY (chatroomID, username),
    FOREIGN KEY (chatroomID) REFERENCES chatRoom (chatroomID),
    FOREIGN KEY (username) REFERENCES users (username)
);

CREATE TABLE awards
(
    awardType VARCHAR2(10) PRIMARY KEY,
    value     INTEGER NOT NULL
);

CREATE TABLE givenToBy
(
    awardType VARCHAR2(10) NOT NULL,
    username  VARCHAR2(50),
    entryID   INTEGER,
    PRIMARY KEY (awardType, username, entryID),
    FOREIGN KEY (awardType) REFERENCES awards (awardType),
    FOREIGN KEY (entryID) REFERENCES entryCreatedBy (entryID),
    FOREIGN KEY (username) REFERENCES users (username)
);

CREATE TABLE follows
(
    followingUsername VARCHAR2(50),
    followedUsername  VARCHAR2(50),
    PRIMARY KEY (followingUsername, followedUsername),
    FOREIGN KEY (followingUsername) REFERENCES users (username),
    FOREIGN KEY (followedUsername) REFERENCES users (username)
);

CREATE TABLE vote
(
    username         VARCHAR2(50),
    entryID          INTEGER,
    upvoteOrDownvote NUMBER(1),
    PRIMARY KEY (username, entryID),
    FOREIGN KEY (entryID) REFERENCES entryCreatedBy (entryID),
    FOREIGN KEY (username) REFERENCES users (username)
);

CREATE TABLE joinsCommunity
(
    username      VARCHAR2(50),
    communityName VARCHAR2(50),
    PRIMARY KEY (username, communityName),
    FOREIGN KEY (communityName) REFERENCES communities (communityName),
    FOREIGN KEY (username) REFERENCES users (username)
);

CREATE TABLE imageContainedBy1
(
    imageID   INTEGER PRIMARY KEY,
    imageFile BLOB,
    width     INTEGER
);

CREATE TABLE imageContainedBy3
(
    imageID   INTEGER PRIMARY KEY,
    imageFile BLOB,
    height    INTEGER
);

CREATE TABLE imageContainedBy5
(
    imageID   INTEGER PRIMARY KEY,
    imageFile BLOB,
    imageSize INTEGER
);

CREATE TABLE imageContainedBy6
(
    attachmentID INTEGER PRIMARY KEY,
    imageFile    BLOB NOT NULL,
    entryID      INTEGER,
    messageID    INTEGER,
    FOREIGN KEY (entryID) REFERENCES postIn (entryID),
    FOREIGN KEY (messageID) REFERENCES messageSentByIn (messageID)
);

CREATE TABLE videoContainedBy1
(
    videoID   INTEGER PRIMARY KEY,
    videoFile BLOB,
    width     INTEGER
);

CREATE TABLE videoContainedBy3
(
    videoID   INTEGER PRIMARY KEY,
    videoFile BLOB,
    height    INTEGER
);

CREATE TABLE videoContainedBy5
(
    videoID   INTEGER PRIMARY KEY,
    videoFile BLOB,
    videoSize INTEGER
);

CREATE TABLE videoContainedBy7
(
    videoID   INTEGER PRIMARY KEY,
    videoFile BLOB,
    duration  INTEGER
);

CREATE TABLE videoContainedBy8
(
    attachmentID INTEGER PRIMARY KEY,
    videoFile    BLOB NOT NULL,
    entryID      INTEGER,
    messageID    INTEGER,
    FOREIGN KEY (entryID) REFERENCES postIn (entryID),
    FOREIGN KEY (messageID) REFERENCES messageSentByIn (messageID)
);
