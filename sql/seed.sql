INSERT INTO teams (id, name, poc_name, poc_email) VALUES
(1, 'Team 1', 'Sarvesh Vaidhi', '2023ee0705@svce.ac.in'),
(2, 'Team 2', 'Siddharth Naren', '2023ee0727@svce.ac.in'),
(3, 'Team 3', 'Salma Siddique', '2023cs0467@svce.ac.in'),
(4, 'Team 4', 'Kaamesh', '2023ec0578@svce.ac.in'),
(5, 'Team 5', 'Anushri', '2023ec0273@svce.ac.in');

INSERT INTO users (name, email, role, team_id) VALUES
('Manoj Kumar', '2022ec0010@svce.ac.in', 'super_admin', NULL),
('Sanjana', '2022ad0650@svce.ac.in', 'super_admin', NULL),
('SriVarshini', '2022cs0379@svce.ac.in', 'super_admin', NULL),
('Jhalak', '2022ad0610@svce.ac.in', 'super_admin', NULL),
('Arunima', '2022ad0589@svce.ac.in', 'super_admin', NULL),
('Kartheesan', '2022cs0138@svce.ac.in', 'super_admin', NULL),
('Karthik', '2022ec0439@svce.ac.in', 'super_admin', NULL),
('Pranoy', '2022me0617@svce.ac.in', 'super_admin', NULL),
('Sandhya', '2022ee0677@svce.ac.in', 'super_admin', NULL),
('Thamizh', '2023ee0724@svce.ac.in', 'super_admin', NULL),
('Mubashir', '2023cs0051@svce.ac.in', 'super_admin', NULL),
('Visvajith', '2023ee0198@svce.ac.in', 'super_admin', NULL),
('Shree Kowsik', '2023cs0470@svce.ac.in', 'super_admin', NULL);

INSERT INTO users (name, email, role, team_id) VALUES
('Sarvesh Vaidhi', '2023ee0705@svce.ac.in', 'admin', 1),
('Siddharth Naren', '2023ee0727@svce.ac.in', 'admin', 2),
('Salma Siddique', '2023cs0467@svce.ac.in', 'admin', 3),
('Kaamesh', '2023ec0578@svce.ac.in', 'admin', 4),
('Anushri', '2023ec0273@svce.ac.in', 'admin', 5);

INSERT INTO users (name, email, role, team_id) VALUES
('Raghav', '2024ec0622@svce.ac.in', 'member', 1),
('Sowmiya', '2024cs0173@svce.ac.in', 'member', 1),
('Ilankavi', '2024bt0704@svce.ac.in', 'member', 1),
('Vikhashini', '2024cs0505@svce.ac.in', 'member', 1),
('Srinidhi', '2024bt0758@svce.ac.in', 'member', 1),
('Shaik Aadhil', '2024ad0686@svce.ac.in', 'member', 1),
('Praneet', '2024ad0788@svce.ac.in', 'member', 1),
('Nivethetha', '2024bt0124@svce.ac.in', 'member', 1),
('Barshana Rani', '2024bt0019@svce.ac.in', 'member', 1),
('Sam Joshua', '2024cs0496@svce.ac.in', 'member', 1),
('Vishwanth', '2024cs0122@svce.ac.in', 'member', 1),
('Nikhil Abisheik', '2024ad0775@svce.ac.in', 'member', 1),
('Sanjay Srinivasan', '2024ec0670@svce.ac.in', 'member', 1),
('Tanish', '2024cs0278@svce.ac.in', 'member', 1);

INSERT INTO users (name, email, role, team_id) VALUES
('Sarabesh Adithya', '2024ec0613@svce.ac.in', 'member', 2),
('Thirushan', '2024cs0063@svce.ac.in', 'member', 2),
('Lathika', '2024ad0767@svce.ac.in', 'member', 2),
('Devadharshini', '2024ec0791@svce.ac.in', 'member', 2),
('Mirthun', '2024cs0244@svce.ac.in', 'member', 2),
('Srikanth', '2024cs0193@svce.ac.in', 'member', 2),
('Pranaya', '2024bt0690@svce.ac.in', 'member', 2),
('Sai Srutthe', '2024cs0497@svce.ac.in', 'member', 2),
('Sree Varshini', '2024bt0564@svce.ac.in', 'member', 2),
('Dharshika Sampathkumar', '2024ad0153@svce.ac.in', 'member', 2),
('Ananya', '2024cs0489@svce.ac.in', 'member', 2),
('Sangavai', '2024ad0737@svce.ac.in', 'member', 2),
('Viswanathan', '2024ec0207@svce.ac.in', 'member', 2),
('Shree Vidhya', '2024ad0746@svce.ac.in', 'member', 2);


INSERT INTO users (name, email, role, team_id) VALUES
('Bhushika', '2024ad0716@svce.ac.in', 'member', 3),
('Sai Harini', '2024ee0147@svce.ac.in', 'member', 3),
('Aadhithya Narayanan', '2024ec0592@svce.ac.in', 'member', 3),
('Mridula', '2024cs0463@svce.ac.in', 'member', 3),
('Shrenik', '2024ec0620@svce.ac.in', 'member', 3),
('Ashwin Kumar', '2024cs0532@svce.ac.in', 'member', 3),
('Akshara Srivatsan', '2024cs0453@svce.ac.in', 'member', 3),
('Guhan Kallapiran', '2024bt0185@svce.ac.in', 'member', 3),
('Kailash', '2024bt0323@svce.ac.in', 'member', 3),
('Thanya Singh', '2024ad0685@svce.ac.in', 'member', 3),
('Shamritha', '2024bt0827@svce.ac.in', 'member', 3),
('Hirthik Mageshkumar', '2024bt0424@svce.ac.in', 'member', 3),
('Pragadheeswaran', '2024cs0551@svce.ac.in', 'member', 3);


INSERT INTO users (name, email, role, team_id) VALUES
('Abhimanyu Singh Bhati', '2024ec0217@svce.ac.in', 'member', 4),
('Vanishri', '2024ec0024@svce.ac.in', 'member', 4),
('Shobana', '2024cs0064@svce.ac.in', 'member', 4),
('Vanthana', '2024ch0883@svce.ac.in', 'member', 4),
('Aadithya', '2024cs0573@svce.ac.in', 'member', 4),
('Athmaja', '2024ec0600@svce.ac.in', 'member', 4),
('Sanjay Joshua', '2024cs0817@svce.ac.in', 'member', 4),
('Harini', '2024cs0450@svce.ac.in', 'member', 4),
('Abrar', '2024ec0635@svce.ac.in', 'member', 4),
('Grisler Paul', '2024ec0231@svce.ac.in', 'member', 4),
('Mohamed Shek Althaaf', '2024ad0156@svce.ac.in', 'member', 4),
('Vaishnavi Chitraa', '2024cs0576@svce.ac.in', 'member', 4),
('Sanjitha', '2024cs0513@svce.ac.in', 'member', 4),
('Pravin Kumaar', '2024mn0769@svce.ac.in', 'member', 4);


INSERT INTO users (name, email, role, team_id) VALUES
('Divyashree', '2024it0289@svce.ac.in', 'member', 5),
('Mayooritha', '2024cs0480@svce.ac.in', 'member', 5),
('Abayambal', '2024ch0414@svce.ac.in', 'member', 5),
('Sathyakaman', '2024ad0731@svce.ac.in', 'member', 5),
('Yadhunandhan', '2024cs0106@svce.ac.in', 'member', 5),
('Tharun Vel', '2024ec0208@svce.ac.in', 'member', 5),
('Shabreen', '2024cs0169@svce.ac.in', 'member', 5),
('Shreenidhi', '2024bt0706@svce.ac.in', 'member', 5),
('Kavya', '2024cs0503@svce.ac.in', 'member', 5),
('Shawn Abraham Joseph', '2024ec0853@svce.ac.in', 'member', 5),
('Jashwanth Shankar', '2024cs0158@svce.ac.in', 'member', 5),
('Sakthi Rasagnya', '2024ee0906@svce.ac.in', 'member', 5),
('Prithivikaa', '2024cs0926@svce.ac.in', 'member', 5),
('Kishore Natrajan', '2024ad0971@svce.ac.in', 'member', 5);
