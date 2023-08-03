const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowerCase: true
    },

    password: {
        type: String,
        required: true
    }

});



userSchema.pre("save", async function(next) {
    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
        console.log(this.password); // Mostrará la contraseña hasheada en la consola
        next();
    } catch (error) {
        console.log(error);
        throw new Error('Falló el hash de contraseña');
    }
})

userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcryptjs.compare(candidatePassword,this.password);

};

const User = mongoose.model("User",userSchema);

module.exports = User;
