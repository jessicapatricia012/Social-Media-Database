INSERT INTO User VALUES 
 ('hpoe01', 'hpoe@outlook.com', '2024-10-16', 'hansel'); 
 ('jpat02', 'jpat@outlook.com', '2024-10-15', 'jessica'); 
 ('jkim03', 'jkim@gmail.com', '2024-10-14', 'jeff' ); 
 ('skat04', 'kat@gmail.com', '2024-10-13', 'kat'); 
 ('ljon05', 'jon@gmail.com', '2024-10-12', 'jon'); 
 ('BillyBobJoe', 'bbj@gmail.com', '2012-01-02', 'IAmBBJ')
 
INSERT INTO Community VALUES: 
('BuildAPC', '1. No harrasment\n 2. No Politics...', 'Welcome to the largest sub on anything 
PC related'), 
('Math', '1. No discussing other subjects\n 2. No Physics discussion...' , 'Discuss anything 
Math here!'), 
('CSCareers', '1. No Grifting\n 2. No Politics...', 'Ask industry Professionals about CS 
career'), 
('AMA', '1. No boring questions\m 2. Be original...', 'Place for interesting people to answer 
questions'), 
('Gaming', '1. Gaming topics only\n 2. No Politics...', 'Discuss the latest gaming news 
here!');

INSERT INTO EntryCreatedBy VALUES 
 (1, '2024-10-15', [content], 'hpoe01'), 
 (2, '2024-10-14', [content], 'hpoe01'), 
 (3, '2024-10-13' [content], 'jpat02'), 
 (4, '2024-10-12', [content], 'skat04'), 
 (5, '2024-10-11' [content],'ljon05'), 
 (6, '2024-10-15', [content], 'hpoe01'), 
 (7, '2024-10-14', [content], 'hpoe01'), 
 (8, '2024-10-13' [content], 'jpat02'), 
 (9, '2024-10-12', [content], 'skat04'), 
 (10, '2024-10-11', [content],'ljon05'); 
 
INSERT INTO PostIn VALUES 
 (1,'New Fallout Game', 'gaming'), 
 (2,'Stuck in this level, pls help', 'gaming'), 
 (3,'How to get a job?',  'CSCareers'), 
 (4,'Stuck in this level, pls help', 'gaming'), 
 (5,'CPU Overheating?',  'BuildAPC'); 
   
INSERT INTO CommentOn VALUES 
 (6, 1), 
 (7, 2), 
 (8, 3), 
 (9, 4), 
 (10, 5); 

INSERT INTO ImageContainedBy1 (imageFile, width) VALUES 
 ([blob of cat image 1], 640), 
 ([blob of cat image 2], 539) 
([blob of dog image 1], 710), 
 ([blob of dog image 2], 600), 
([blob of snake image], 1200); 

INSERT INTO ImageContainedBy3 (imageFile, height) VALUES 
 ([blob of cat image 1], 426), 
 ([blob of cat image 2], 360), 
([blob of dog image 1], 340), 
([blob of dog image 2], 400), 
([blob of snake image], 800); 

INSERT INTO ImageContainedBy5 (imageFile, size) VALUES 
 ([blob of cat image 1, 2097152]), 
([blob of cat image 2, 2813651]), 
([blob of dog image 1, 2907322]), 
([blob of dog image 2, 3362163]), 
([blob of snake image, 1342344]); 

INSERT INTO ImageContainedBy6 (attachmentID, imageFile, entryID, messageID) VALUES 
 (1, [blob of cat image 1],  1, NULL), 
(2, [blob of cat image 2], 2, NULL), 
(3, [blob of dog image 1], NULL, 3), 
(4, [blob of dog image 2], NULL, 4), 
(5, [blob of snake image ], 5, NULL); 

INSERT INTO VideoContainedBy1 VALUES 
 ([blob of video 1], 1280), 
([blob of video 2], 1280), 
([blob of video 3], 1920), 
([blob of video 4], 1920), 
([blob of video 5], 1280); 

INSERT INTO VideoContainedBy3 VALUES 
([blob of video 1], 720), 
([blob of video 2], 720), 
([blob of video 3], 1080), 
([blob of video 4], 1080), 
([blob of video 5], 720); 

INSERT INTO VideoContainedBy5 VALUES 
([blob of video 1], 431231231), 
([blob of video 2], 213312321424), 
([blob of video 3], 453255446), 
([blob of video 4], 534563536), 
([blob of video 5], 43524542352); 

INSERT INTO VideoContainedBy7 VALUES (HH:mm:ss) 
([blob of video 1], '00: 04:15'), 
([blob of video 2], '00:00:34'), 
([blob of video 3],  '00:01:21'), 
([blob of video 4], '00:00:40'), 
([blob of video 5], '00:04:14'); 

INSERT INTO VideoContainedBy8 VALUES 
(6, [blob of video 1], 1, NULL), 
(7, [blob of video 2], 2, NULL), 
(8, [blob of video 3], NULL, 3), 
(9, [blob of video 4], NULL,4), 
(10, [blob of video 5], 5,NULL); 
 
INSERT INTO ChatRoom VALUES 
(1, 'Group 1'), 
(2, 'Group 2'), 
(3, 'Group 3'), 
(4, 'Group 4'), 
(5, 'Group 5'); 
 
INSERT INTO JoinsChatRoom VALUES 
(1,'hpoe01'), 
(1, 'jpat02'), 
(2, 'hpoe01'), 
(4, 'skat04'), 
(5, 'skat04'); 
 
INSERT INTO MessageSentByIn VALUES 
 (1, '2024-10-15', [content], 'hpoe01', 1), 
 (2, '2024-10-14', [content], 'hpoe01', 1), 
 (3, '2024-10-13', [content], 'jpat02', 1), 
 (4, '2024-10-12', [content], 'skat04', 4), 
 (5, '2024-10-11', [content], 'skat04', 5); 
 
INSERT INTO Award VALUES 
 ('Gold', 100), 
('Silver', 75), 
('Bronze', 50), 
('Balloon', 25), 
('Rose', 10); 
 
INSERT INTO GivenToBy VALUES 
 ('Gold',  'hpoe01', 1), 
('Gold',  'hpoe01', 1), 
('Balloon',  'jpat02', 2), 
('Rose',  'jpat02', 2), 
('Rose',  'skaat04', 7); 

INSERT INTO Follows VALUES 
 ('hpoe01', 'jpat02'), 
 ('jpat02', 'hpoe01'), 
 ('skat04', 'hpoe01'), 
 ('hpoe01', 'skat04'), 
 ('skat04', 'ljon05'); 
 
INSERT INTO Vote VALUES 
 ('jpat02', 1, 1), 
('jpat02', 2, 1), 
('hpoe01', 3, 0), 
('hpoe01', 4, 0), 
('skat04', 5, 1); 
 
INSERT INTO JoinsCommunity VALUES 
 ('hpoe01', 'Gaming'), 
('hpoe01', 'BuildAPC'), 
('jpat02', 'CSCareers'), 
('skat04', 'Gaming'), 
('ljon05', 'BuildAPC'); 