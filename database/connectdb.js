const mongoose = require('mongoose');

try {
    mongoose.connect(process.env.URI_MONGO);
} catch (error) {
console.log('Error de conexion a mongodb:',error)

}
