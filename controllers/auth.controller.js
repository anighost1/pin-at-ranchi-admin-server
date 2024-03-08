import jwt from "jsonwebtoken"

import Admin from "../models/admin.model.js"


const maxAge = 60 * 60 * 24

const createToken = (admin) => {
    return jwt.sign(
        {
            id: admin._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: maxAge
        }
    )
}


export const register = async (req, res) => {
    const newAdmin = new Admin(req.body)
    try {
        await newAdmin.save()
        res.status(200).json({
            message: 'Admin successfully added'
        })
    } catch (e) {
        if (e.name === 'ValidationError') {
            const validationErrors = Object.values(e.errors).map(err => err.message);
            res.status(400).json({
                message: 'Validation error',
                errors: validationErrors
            });
        } else {
            console.error(e);
            res.status(500).json({
                message: 'Admin addition unsuccessful'
            });
        }
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const admin = await Admin.login(email, password)
        res.status(200).json({
            message: 'Login successful',
            token: createToken(admin)
        })
    } catch (e) {
        if (e.name === 'ValidationError') {
            const validationErrors = Object.values(e.errors).map(err => err.message);
            res.status(400).json({
                message: 'Validation error',
                errors: validationErrors
            });
        } else {
            console.error(e);
            res.status(403).json({
                message: 'Login failed',
                error: e
            });
        }
    }
}


export const logout = async (req, res) => {
    res.cookie('token', '', { maxAge: 1 })
    res.end()
}
