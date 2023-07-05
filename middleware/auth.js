const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Employee = require('../models/Employee');

// Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if decoded has id property
    if (!decoded.id) {
      return next(new ErrorResponse('Invalid token', 401));
    }

    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return next(new ErrorResponse('User not found', 404));
    }

    next();
  } catch (error) {
    return next(new ErrorResponse('Invalid token', 401));
  }
});

//Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

//Grants access to specifc employee type
exports.authorizeEmployee =
  (...types) =>
  async (req, res, next) => {
    //Get the logged in user id
    const userId = req.user._id;
    const userRole = req.user.role;

    const employee = await Employee.findOne({ user: userId });
    console.log(employee);

    if (!employee) {
      return next(new ErrorResponse('Employee not found', 404));
    }
    if (!types.includes(employee.type) && userRole != 'admin') {
      return next(
        new ErrorResponse(
          `Employee role ${employee.type} is not authorized to access this route`,
          403
        )
      );
    }

    next();
  };
