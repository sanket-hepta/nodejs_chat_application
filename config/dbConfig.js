const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.Promise = global.Promise;
exports.dbConnect = () => mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true})
                                    .then(() => {
                                        console.log("Database connected successfully.");
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });