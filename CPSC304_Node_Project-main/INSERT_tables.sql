

INSERT INTO USERS (USERNAME, EMAIL, DATEJOINED, DISPLAYNAME)
VALUES
    ('hpoe01', 'hpoe@outlook.com', TO_DATE('2024-10-16', 'YYYY-MM-DD'), 'hansel');
INSERT INTO USERS (USERNAME, EMAIL, DATEJOINED, DISPLAYNAME)
VALUES
    ('jpat02', 'jpat@outlook.com', TO_DATE('2024-10-15', 'YYYY-MM-DD'), 'jessica');
INSERT INTO USERS (USERNAME, EMAIL, DATEJOINED, DISPLAYNAME)
VALUES
    ('jkim03', 'jkim@gmail.com', TO_DATE('2024-10-14', 'YYYY-MM-DD'), 'jeff');
INSERT INTO USERS (USERNAME, EMAIL, DATEJOINED, DISPLAYNAME)
VALUES
    ('skat04', 'kat@gmail.com', TO_DATE('2024-10-13', 'YYYY-MM-DD'), 'kat');
INSERT INTO USERS (USERNAME, EMAIL, DATEJOINED, DISPLAYNAME)
VALUES
    ('ljon05', 'jon@gmail.com', TO_DATE('2024-10-12', 'YYYY-MM-DD'), 'jon');
INSERT INTO USERS (USERNAME, EMAIL, DATEJOINED, DISPLAYNAME)
VALUES
    ('BillyBobJoe', 'bbj@gmail.com', TO_DATE('2012-01-02', 'YYYY-MM-DD'), 'IAmBBJ');
 

INSERT INTO COMMUNITIES(COMMUNITYNAME, RULE, DESCRIPTION) VALUES
('BuildAPC', '1. No harrasment\n 2. No Politics...', 'Welcome to the largest sub on anything
PC related');
INSERT INTO COMMUNITIES(COMMUNITYNAME, RULE, DESCRIPTION) VALUES
('Math', '1. No discussing other subjects\n 2. No Physics discussion...' , 'Discuss anything
Math here!');
INSERT INTO COMMUNITIES(COMMUNITYNAME, RULE, DESCRIPTION) VALUES
('CSCareers', '1. No Grifting\n 2. No Politics...', 'Ask industry Professionals about CS
career');
INSERT INTO COMMUNITIES(COMMUNITYNAME, RULE, DESCRIPTION) VALUES
('AMA', '1. No boring questions\m 2. Be original...', 'Place for interesting people to answer
questions');
INSERT INTO COMMUNITIES(COMMUNITYNAME, RULE, DESCRIPTION) VALUES
('Gaming', '1. Gaming topics only\n 2. No Politics...', 'Discuss the latest gaming news
here!');

SELECT * FROM USERS;