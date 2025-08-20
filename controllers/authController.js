const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const register = async (req, res) => {
    const {name, email, password} = req.body

    try {
        //console.log("Requisição reccebida com body: ", req.body)
        const userExists = await User.findOne({ email })
        //console.log("Resultado de busca por E-mail: ", userExists)
        if (userExists){
            return res.status(400).json({message: "E-mail já registrado"})
        }
        
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = new User({
            name,
            email,
            password: hashedPassword,
        })

        await user.save()
        
        res.status(201).json({message: "Usuário criado com sucesso"})
    } catch (error) {
        res.status(501).json({message: "Erro no Registro", error: error.message})
    }
}

const login = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.findOne({ email })
        if (!user){
            return res.status(401).json({message: "Usuário não encontrado"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch){
            return res.status(401).json({message: "Senha incorreta"})
        }

        const token = jwt.sign(
            { id: user._id},
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.json({message: "Login efetuado com sucesso", token})
    } catch (error) {
        res.status(500).json({message: "Erro no Login", error: error.message})
    }
}

module.exports = {register, login}