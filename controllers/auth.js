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

        sendTokenResponse(user, 200, res);
    
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

// @desc   Loginuser
// @route  POST /api/v1/auth/login
// @access Public

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
  
    // Validate emil & password
    if (!email || !password) {
      return next(new ErrorResponse('Please provide an email and password', 400));
    }
  
    // Check for user
    const user = await User.findOne({ email }).select('+password');
  
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }
  
    // Check if password matches
    const isMatch = await user.matchPassword(password);
  
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);

  });

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
  
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
  
    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }
  
    res
      .status(statusCode)
      .cookie('token', token, options)
      .json({
        success: true,
        token
      });
  };
