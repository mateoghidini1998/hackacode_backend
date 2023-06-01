const Employee = require('../models/Employee');

// @desc   Create Employee
// @route  POST /api/employees/register
// @access Private

exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.create({
            email,
            password
        });
        res.status(201).json({
            success: true,
            data: user
        })
    } catch (error) {
        res.status(400).json({
            success: false
        });
    }
};