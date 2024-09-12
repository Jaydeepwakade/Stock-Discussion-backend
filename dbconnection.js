  const mongoose = require("mongoose")
 const mongoURl = process.env.DB_URL
 
  const DatabaseConnection = async()=>{
       try {
         await mongoose.connect(mongoURl)
          console.log("connection to database sucessfull")
       } catch (error) {
         console.log("error while connecting the database")
       }
  }

  module.exports = DatabaseConnection