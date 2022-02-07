// Imports the Google Cloud client library
const {Spanner} = require('@google-cloud/spanner')

// Initiate a client (Local)
// const spanner = new Spanner({
//       projectId: process.env.PROJECT_ID,
//       keyFilename: process.env.KEY_FILENAME
// })

const spanner = new Spanner()

// Your Cloud Spanner instance ID
const instanceId = process.env.SPANNER_INSTANCE_ID

// Your Cloud Spanner database ID
const databaseId = process.env.SPANNER_DATABASE_ID

// Gets a reference to a Cloud Spanner instance and database
const instance = spanner.instance(instanceId)
const db = instance.database(databaseId)
const table = db.table(process.env.SPANNER_TABLE_NAME)

module.exports = { db, table }