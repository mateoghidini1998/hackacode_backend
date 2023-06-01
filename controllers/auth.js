const User = require('../models/User');
const Employee = require('../models/Employee');

// @desc   Register user
// @route  POST /api/auth/register
// @access Public

exports.register = async (req, res, next) => {
    try {
        const { email, password, name, lastName } = req.body;
        const user = await User.create({
            email,
            password
        });

        const employee = await Employee.create({
            name,
            lastName,
            user: user._id
        })

        res.status(201).json({
            success: true,
            data: user, employee
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false
        });
    }
};

// @desc   Get users
// @route  GET /api/auth/users
// @access Public

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        })
    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
};

// @desc   Get a user
// @route  GET /api/auth/users/:id
// @access Public

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);;
        if(!user){
            res.status(400).json({
                success: false
            });
        }

        res.status(200).json({
            success: true,
            data: user
        })

    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
};

// @desc   Update a user
// @route  PUT /api/auth/users/:id
// @access Private

exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        if(!user){
            res.status(400).json({
                success: false
            });
        }

        res.status(200).json({
            success: true,
            data: user
        })

    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
};


// @desc   Delete a user
// @route  DELETE /api/auth/users/:id
// @access Private

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            res.status(400).json({
                success: false
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        })

    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
};

/* exports.loginUser = async (req, res, next) => {

    const { email, password } = req.body;

    if(!email || !password){
        return next(new ErrorResponse('Please provide an email and password', 400));
    }


} */