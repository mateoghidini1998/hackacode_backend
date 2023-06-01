const User = require('../models/User');
const Employee = require('../models/Employee');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc   Register user
// @route  POST /api/auth/register
// @access Public

exports.register = asyncHandler(async (req, res, next) => {
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
    
});

// @desc   Get users
// @route  GET /api/auth/users
// @access Public

exports.getUsers = asyncHandler(async (req, res, next) => {
        const users = await User.find();
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        })

    
});

// @desc   Get a user
// @route  GET /api/auth/users/:id
// @access Public

exports.getUser = asyncHandler(async (req, res, next) => {
        const user = await User.findById(req.params.id);;
        if(!user){
            return next (new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: user
        })
});

// @desc   Update a user
// @route  PUT /api/auth/users/:id
// @access Private

exports.updateUser = asyncHandler(async (req, res, next) => {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        if(!user){
            return next (new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: user
        })

});


// @desc   Delete a user
// @route  DELETE /api/auth/users/:id
// @access Private

exports.deleteUser = asyncHandler(async (req, res, next) => {
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return next (new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: {}
        })

});

