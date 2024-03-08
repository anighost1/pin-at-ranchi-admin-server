import Jwt from "jsonwebtoken"
import Admin from "../models/admin.model.js"

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).send("No authorizaztion token provided")
    }
    const token = authorization.split(' ')[1]
    try {
        const { id } = Jwt.verify(token, process.env.JWT_SECRET)
        const isExist = await Admin.countDocuments({ "_id": id })
        if (isExist) {
            req.user = id
            // console.log("\x1b[36m%s\x1b[0m","require auth hit")
            next()
        } else {
            return res.status(401).send("Unauthorized reqest")
        }
    } catch (err) {
        console.log(err)
    }
}

export default requireAuth