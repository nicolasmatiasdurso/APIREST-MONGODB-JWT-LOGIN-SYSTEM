const User = require('../user.js');
const jwt = require('jsonwebtoken');

const register = async(req,res) =>{
    const {email,password} = req.body;

    try {
        const user = new User({email,password});
        await user.save();

        // jwt token

        return res.json({ok: true});
    } catch (error) {
        if (error.code===11000){
            return res.status(400).json({Error: "Ya existe el usuario"});
        }
        return res.status(500).json({Error: "Error en servidor"});
    }
};

const login = async(req,res) =>{

    try {
        const {email,password} = req.body;

        let user = await User.findOne ({email});

        if (!user) return res.status(403).json({error: "Las credenciales no coinciden"});

        const respuestaPassword = await user.comparePassword(password);
        if (!respuestaPassword) {
            return res.status(403).json({Error: "Las credenciales no coinciden"});
        }

        const token = jwt.sign({uid: user.id},process.env.JWT_SECRET);

        return res.json({ok: token});
    } catch (error) {
        console.log(error);
    }
};

module.exports = { login, register };


