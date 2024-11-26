

INSERT INTO USERS (USERNAME, EMAIL, DISPLAYNAME, DATEJOINED) VALUES
    ('hpoe01', 'hpoe@outlook.com', 'hansel', TO_DATE('2024-10-16', 'YYYY-MM-DD'));
INSERT INTO USERS (USERNAME, EMAIL, DISPLAYNAME, DATEJOINED) VALUES
    ('jpat02', 'jpat@outlook.com', 'jessica', TO_DATE('2024-10-15', 'YYYY-MM-DD'));
INSERT INTO USERS (USERNAME, EMAIL, DISPLAYNAME, DATEJOINED) VALUES
    ('jkim03', 'jkim@gmail.com', 'jeff', TO_DATE('2024-10-14', 'YYYY-MM-DD'));
INSERT INTO USERS (USERNAME, EMAIL, DISPLAYNAME, DATEJOINED) VALUES
    ('skat04', 'kat@gmail.com', 'kat', TO_DATE('2024-10-13', 'YYYY-MM-DD'));
INSERT INTO USERS (USERNAME, EMAIL, DISPLAYNAME, DATEJOINED) VALUES
    ('ljon05', 'jon@gmail.com', 'jon', TO_DATE('2024-10-12', 'YYYY-MM-DD'));
INSERT INTO USERS (USERNAME, EMAIL, DISPLAYNAME, DATEJOINED) VALUES
    ('BillyBobJoe', 'bbj@gmail.com', 'IAmBBJ', TO_DATE('2012-01-02', 'YYYY-MM-DD'));


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

INSERT INTO ENTRYCREATEDBY VALUES
	(1, '2024-10-15', [content], 'hpoe01'),
	(2, '2024-10-14', [content], 'hpoe01'),
	(3, '2024-10-13', [content], 'jpat02'),
    (4, '2024-10-12', [content], 'skat04'),
	(5, '2024-10-11', [content], 'ljon05'),

;
