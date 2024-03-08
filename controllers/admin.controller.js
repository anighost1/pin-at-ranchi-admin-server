import Admin from "../models/admin.model.js";


export const getAdmin = async (req, res) => {
    try {
        const admin = await Admin.find().select('-password')
        res.status(200).json(admin)
    } catch (e) {
        console.error(e);
        res.status(403).json({
            message: 'Login failed',
            error: e
        });
    }
}


export const getAdminById = async (req, res) => {
    const id = req.params.id
    try {
        const admin = await Admin.findById(id).select('-password');
        res.json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Admin Data'
        });
    }
}