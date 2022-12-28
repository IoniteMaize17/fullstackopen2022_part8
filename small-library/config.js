require('dotenv').config()

const PORT = process.env.PORT || 4000
const NODE_ENV = process.env.NODE_ENV || 'production'
const SECRET = process.env.SECRET || 'kBlJYfAqG7aJSIV67NqL38MXds7eHj1I'
const PASSWORD_DEFAULT = "library_2022"
let MONGODB_URI
if (NODE_ENV === 'test') {
  MONGODB_URI = process.env.MONGODB_TEST_URI
} else {
  MONGODB_URI = process.env.MONGODB_URI
}

module.exports = {
  MONGODB_URI,
  PORT,
  NODE_ENV,
  SECRET,
  PASSWORD_DEFAULT
}