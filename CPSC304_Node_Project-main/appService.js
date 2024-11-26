const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchTableFromDb(table) {
    return await withOracleDB(async (connection) => {
        const sql = `SELECT * FROM ${table}`;
        const result = await connection.execute(sql);
        return result;
    }).catch((err) => {
        console.error(err);
        return [];
    });
}

async function initializeCreateTables() {
    return await withOracleDB(async (connection) => {
        const fs = require('fs');
        const sqlScript = fs.readFileSync('./CREATE_tables.sql', 'utf-8');

        // Split the SQL commands and process them
        const sqlStatements = sqlScript.split(';').map(command => command.trim()).filter(command => command);

        try {
            for (const statement of sqlStatements) {
                console.log(statement);
                if (statement) {
                    try {
                        const result = await connection.execute(statement);
                        await connection.execute('COMMIT');
                    } catch (error) {
                        // Simplified error handling (let console.error below catch it)
                            throw error;
                    }
                }
            }
            console.log('INIT: SQL script executed successfully.');
            return true; 
        } catch (error) {
            console.error('INIT: Error executing SQL script:', error);
            return false;
        }
    });
}

async function insertUser(username,email, dateJoined, name){
     return await withOracleDB(async (connection) => {
        //For Debugging
        // console.log(username);
        // console.log(email);
        // console.log(name);
        // console.log(dateJoined);

        //This fixes bugs, IDK Why or How, all I know is I'm tired :)
        const userName = username;
        const emailAddr = email;
        const disName = name;
        const dateObj = new Date(dateJoined);
        //const dateString = dateObj.toLocaleDateString('en-CA'); // in Format YYYY-MM-DD

        //For Debugging
        //console.log(dateObj);
       //console.log(dateString);

        const result = await connection.execute(
            `INSERT INTO USERS(username, email, dateJoined, displayName) VALUES (:userName, :emailAddr, :dateObj, :disName)`,
            [userName, emailAddr, dateObj, disName],
            { autoCommit: true }
        );
        console.log("INSERT_USER: User Insertion succesful!")
        console.log(result.rows);//For Debugging

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertPost(user,title, community, content, date){
        return await withOracleDB(async (connection) => {
            try{

                const dateObj = new Date(date);
                //Insert into EntryCreatedBy
                const resultEntry = await connection.execute(//id is automatically generated by Oracle
                    'INSERT INTO ENTRYCREATEDBY(dateCreated, content, username) VALUES (:myDate, :myContent, :myUser) RETURN entryID INTO :myId',
                    {   
                        myDate: dateObj,
                        myContent: content,
                        myUser: user,
                        myId : {type: oracledb.NUMBER, dir: oracledb.BIND_OUT}
                    },
                    {autoCommit: true}
                );

                insertID = resultEntry.outBinds.myId[0];
                //console.log("InsertID:", insertID);//Debugging

                //Insert into PostIn 
                const resultPost = await connection.execute(
                    'INSERT INTO POSTIN(entryID, title,communityName) VALUES (:myId, :myTitle, :myCommunity)',
                    [insertID, title, community],
                    {autoCommit: true}
                );
                
                console.log("INSERT_POST: Post Insertion Succesful!");
                return (resultEntry.rowsAffected && resultEntry.rowsAffected > 0 &&
                        resultPost.rowsAffected && resultPost.rowsAffected > 0);
            } catch (error){
                console.log("INSERT_POST: Error inserting post:", error);
                return false;
            }
        });
}

async function insertTables() {
    return await withOracleDB(async (connection) => {
        const fs = require('fs');
        const sqlScript = fs.readFileSync('./INSERT_tables.sql', 'utf-8');

        // Split the SQL commands and process them
        const sqlStatements = sqlScript.split(';').map(command => command.trim()).filter(command => command);

        try {
            for (const statement of sqlStatements) {
                console.log(statement);//For Debugging
                if (statement) {
                    try {
                        const result = await connection.execute(statement);
                        await connection.execute('COMMIT');
                    } catch (error) {
                        throw error;
                    }
                }
            }
            console.log('INSERT: SQL script executed successfully.');
            return true;
        } catch (error) {
            console.error('Error executing SQL script:', error);
            return false;
        }
    });
}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}


module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable, 
    insertDemotable, 
    updateNameDemotable, 
    countDemotable,
    initializeCreateTables,
    insertTables,
    fetchTableFromDb,
    insertUser,
    insertPost
};