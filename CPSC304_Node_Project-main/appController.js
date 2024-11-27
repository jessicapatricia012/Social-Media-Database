const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

// Execute the SQL file and create tables
router.post("/initiate_create_table", async (req, res) => {
    const initiateResult = await appService.initializeCreateTables();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert_table", async (req, res) => {
    const initiateResult = await appService.insertTables();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


router.get('/projection/:query', async (req, res) => {
    // Extract the query from the URL parameters.
    const queryParam = req.params.query;

    // Log the received query.
    console.log('Received Query:', queryParam);

    if (!queryParam) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        // Decode the query parameter (since it might be URL encoded).
        const decodedQuery = decodeURIComponent(queryParam);
        console.log("Decoded Query:", decodedQuery);

        // Perform the database query with the decoded query string.
        const tableContent = await appService.projectionTableFromDb(decodedQuery);

        // Send the response with the data.
        res.json({ data: tableContent });
    } catch (err) {
        console.error("Error processing query:", err.message);
        res.status(500).json({ error: 'Error fetching data' });
    }
});


router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.get('/table/:name', async (req, res) => {
    const tableName = req.params.name;

    if (!tableName) {
        return res.status(400).json({ error: 'Table name is required' });
    }

    try {
        const tableContent = await appService.fetchTableFromDb(tableName);
        res.json({ data: tableContent});
    } catch (err) {
        res.status(500).json({ error: 'Error fetching table data' });
    }
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/initiate-tables", async (req, res) => {
    const initiateResult = await appService.initiateTables();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/insert-user' , async (req, res) => {
    const {username, email ,dateJoined, name} = req.body;

    const insertResult = await appService.insertUser(username, email, dateJoined, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/insert-post' , async (req, res) => {
    const {user, title, community, content, date} = req.body;
    const insertResult = await appService.insertPost(user, title, community, content, date);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/delete-user", async(req,res) =>{
    const {username} = req.body;
    const deleteResult = await appService.deleteUser(username);

        if (deleteResult){
            res.json({success:true});
        } else{
            res.status(500).json({success:false});
        }
});


router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-user", async (req, res) => {
    console.log('update router');
    const { username, email, displayName, dateJoined } = req.body;
    
    try {
        const updateResult = await appService.updateUser(username, email, displayName, dateJoined);
        if (updateResult) {
            res.json({ success: true });
        } else {
            res.status(500).json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
   
});

router.post("/select-award", async (req, res) => {
    console.log('search router');//not called
    const clauses = req.body.clauses;
    console.log('a', clauses);
    
    const searchResult = await appService.selectAward(clauses);
    if (searchResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
   
});

router.post("/aggregate-having", async (req, res) => {
    console.log('a-having router');   //not called
    const searchResult = await appService.aggregateHaving();
    if (searchResult) {
        if (searchResult.length>0)
            res.json({ success: true, data: searchResult });
        else
            res.json({ success: true, data: [] });
    } else {
        res.status(500).json({ success: false });
    }
   
});

router.post("/division", async (req, res) => {
    console.log('division router');   //not called
    const searchResult = await appService.division();
    if (searchResult) {
        if (searchResult.length>0)
            res.json({ success: true, data: searchResult });
        else
            res.json({ success: true, data: [] });
    } else {
        res.status(500).json({ success: false });
    }
   
});

// router.get('/count-demotable', async (req, res) => {
//     const tableCount = await appService.countDemotable();
//     if (tableCount >= 0) {
//         res.json({ 
//             success: true,  
//             count: tableCount
//         });
//     } else {
//         res.status(500).json({ 
//             success: false, 
//             count: tableCount
//         });
//     }
// });


module.exports = router;