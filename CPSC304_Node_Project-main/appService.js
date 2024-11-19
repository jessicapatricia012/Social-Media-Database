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
        return result.rows;
    }).catch((err) => {
        console.error(err);
        return [];
    });
}

async function initiateTables() {
    const map = new Map;
    map.set('USERS', `
    CREATE TABLE users (
        username VARCHAR(20) PRIMARY KEY,
        email VARCHAR(20) NOT NULL,
        dateJoined DATE NOT NULL,
        displayName VARCHAR(20),
        followingUsername VARCHAR(20),
        followedUsername VARCHAR(20),
        UNIQUE (email)
    )
`);
    map.set('COMMUNITIES', `
        CREATE TABLE communities (
                                     communityName VARCHAR(20) PRIMARY KEY,
                                     rule VARCHAR2(1000), -- Up to 4000 characters
                                     description VARCHAR(250)
        )
`);
    map.set('ENTRYCREATEDBY', `
        CREATE TABLE entryCreatedBy (
                                        entryID INTEGER PRIMARY KEY,
                                        dateCreated DATE,
                                        content VARCHAR2(1000),
                                        username VARCHAR(20)
        )
        `);
    map.set('POSTIN', `
        CREATE TABLE postIn (
                                entryID INTEGER PRIMARY KEY,
                                title VARCHAR2(100) NOT NULL,
                                communityName VARCHAR(20) NOT NULL,
                                FOREIGN KEY (communityName) REFERENCES communities(communityName),
                                FOREIGN KEY (entryID) REFERENCES entryCreatedBy(entryID)
        )
        `);
    map.set('COMMENTON', `
        CREATE TABLE commentOn (
                                   entryID INTEGER PRIMARY KEY,
                                   onEntryID INTEGER NOT NULL,
                                   FOREIGN KEY (onEntryID) REFERENCES entryCreatedBy(entryID),
                                   FOREIGN KEY (entryID) REFERENCES entryCreatedBy(entryID)
        );
        `);
    map.set('CHATROOM', `
        CREATE TABLE chatRoom (
                                  chatroomID INTEGER PRIMARY KEY,
                                  name VARCHAR(20)
        )
        `);
    map.set('MESSAGESENTBYIN', `
        CREATE TABLE messageSentByIn (
                                         messageID INTEGER PRIMARY KEY,
                                         dateSent DATE NOT NULL,
                                         content VARCHAR2(1000) NOT NULL,
                                         username VARCHAR(20) NOT NULL,
                                         chatroomID INTEGER NOT NULL,
                                         FOREIGN KEY (chatroomID) REFERENCES chatRoom,
                                         FOREIGN KEY (username) REFERENCES users(username)
        )
        `);
    map.set('JOINSCHATROOM', `
        CREATE TABLE joinsChatRoom (
                                       chatroomID INTEGER,
                                       username VARCHAR(20),
                                       PRIMARY KEY (chatroomID, username),
                                       FOREIGN KEY (chatroomID) REFERENCES chatRoom,
                                       FOREIGN KEY (username) REFERENCES users(username)
        )
        `);
    map.set('GIVENTOBY', `
        CREATE TABLE givenToBy (
                                   awardType VARCHAR(10) NOT NULL,
                                   username VARCHAR(20),
                                   entryID INTEGER,
                                   PRIMARY KEY (awardType, username, entryID),
                                   FOREIGN KEY (awardType) REFERENCES awards(awardType),
                                   FOREIGN KEY (entryID) REFERENCES EntryCreatedBy,
                                   FOREIGN KEY (username) REFERENCES users(username)
        )
        `);
    map.set('FOLLOWS', `
        CREATE TABLE follows (
                                 followingUsername  VARCHAR(20),
                                 followedUsername   VARCHAR(20),
                                 PRIMARY KEY(followingUsername, followedUsername),
                                 FOREIGN KEY (followingUsername) REFERENCES users(username),
                                 FOREIGN KEY (followedUsername) REFERENCES users(username)
        )
        `);
    map.set('VOTE', `
        CREATE TABLE vote (
                              username VARCHAR(20),
                              entryID INTEGER,
                              upvoteOrDownvote NUMBER(1),
                              PRIMARY KEY(username, entryID),
                              FOREIGN KEY (entryID) REFERENCES EntryCreatedBy,
                              FOREIGN KEY (username) REFERENCES users(username)
        )
        `);
    map.set('JOINSCOMMUNITY', `
        CREATE TABLE joinsCommunity(
                                       username VARCHAR(20),
                                       communityName VARCHAR(20),
                                       PRIMARY KEY (username, communityName),
                                       FOREIGN KEY (communityName) REFERENCES communities(communityName),
                                       FOREIGN KEY (username) REFERENCES users(username)
        )
        `);
    map.set('IMAGECONTAINEDBY1', `
        CREATE TABLE imageContainedBy1 (
                                           imageID INTEGER PRIMARY KEY,
                                           imageFile BLOB,
                                           width INTEGER
        )
        `);
    map.set('IMAGECONTAINEDBY3', `
        CREATE TABLE imageContainedBy3(
                                          imageID INTEGER PRIMARY KEY,
                                          imageFile BLOB,
                                          height INTEGER
        )
        `);
    map.set('IMAGECONTAINEDBY5', `
        CREATE TABLE imageContainedBy5(
                                          imageID INTEGER PRIMARY KEY,
                                          imageFile BLOB,
                                          imageSize INTEGER
        )
        `);
    map.set('IMAGECONTAINEDBY6', `
        CREATE TABLE imageContainedBy6(
                                          AttachmentID INTEGER  PRIMARY KEY,
                                          imageFile BLOB NOT NULL,
                                          entryID INTEGER,
                                          messageID INTEGER,
                                          FOREIGN KEY (entryID) REFERENCES PostIn,
                                          FOREIGN KEY (messageID) REFERENCES MessageSentByIn
        )
        `);
    map.set('VIDEOCONTAINEDBY1', `
        CREATE TABLE videoContainedBy1 (
                                           videoID INTEGER PRIMARY KEY,
                                           videoFile BLOB,
                                           width INTEGER
        )
        `);
    map.set('VIDEOCONTAINEDBY3', `
        CREATE TABLE videoContainedBy3 (
                                           videoID INTEGER PRIMARY KEY,
                                           videoFile BLOB,
                                           height INTEGER
        )
        `);
    map.set('VIDEOCONTAINEDBY5', `
        CREATE TABLE videoContainedBy5 (
                                           videoID INTEGER PRIMARY KEY,
                                           videoFile BLOB,
                                           videoSize INTEGER
        )
        `);
    map.set('VIDEOCONTAINEDBY7', `
        CREATE TABLE videoContainedBy7 (
                                           videoID INTEGER PRIMARY KEY,
                                           videoFile BLOB,
                                           duration INTEGER
        )
        `);
    map.set('IMAGECONTAINEDBY8', `
        CREATE TABLE videoContainedBy8(
                                          attachmentID INTEGER  PRIMARY KEY,
                                          videoFile BLOB NOT NULL,
                                          entryID INTEGER,
                                          messageID INTEGER,
                                          FOREIGN KEY (entryID) REFERENCES PostIn,
                                          FOREIGN KEY (messageID) REFERENCES MessageSentByIn
        )
        `);

    try {
        await initMap(map);
        return true;
    } catch (err) {
        return false;
    }
}
async function initMap(map) {
    return await withOracleDB(async (connection) => {
        for (const [tableName, createTableSQL] of map) {
            try {
                console.log(`Dropping table: ${tableName}`);
                await connection.execute(`DROP TABLE ${tableName}`);
            } catch (err) {
                console.log(`Table ${tableName} might not exist, proceeding to create...`);
            }

            try {
                console.log(`Creating table: ${tableName}`);
                await connection.execute(createTableSQL);
            } catch (err) {
                console.error(`Failed to create table ${tableName}:`, err.message);
                throw err; // Optionally rethrow to stop the loop if creation fails
            }
        }
        return true;
    }).catch((err) => {
        console.error("Error during table initialization:", err.message);
        return false;
    });
}
async function initAwards() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE AWARDS`);
        } catch(err) {
            console.log('table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE awards (
                                    awardType VARCHAR(10)  PRIMARY KEY,
                                    value INTEGER NOT NULL
            )
        `);
        return true;
    }).catch(() => {
        return false;
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
    initiateTables,
    fetchTableFromDb
};