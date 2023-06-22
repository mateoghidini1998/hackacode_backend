const Employee = require('../models/Employee');
const asyncHandler = require('../middleware/async');

// @desc   Register Employee
// @route  POST /api/employees/register
// @access Private

/* exports.register = asyncHandler(async (req, res, next) => {
    const { name, lastName, dni } = req.body;
    const employee = await Employee.create({
        name,
        lastName
    });

    res.status(201).json({
        success: true,
        data: employee
    })

    

}); */

// @desc   Get all Employees
// @route  GET /api/employees/
// @access Public

exports.getEmployees = asyncHandler(async (req, res, next) => {
  const employees = await Employee.find();

  res.status(201).json({
    success: true,
    count: employees.length,
    data: employees,
  });
});

// @desc   Get a Employee
// @route  GET /api/employees/:id
// @access Private

exports.getEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(
      new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    success: true,
    data: employee,
  });
});

// @desc   Update a Employee
// @route  PUT /api/employees/:id
// @access Private

exports.updateEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!employee) {
    return next(
      new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    success: true,
    data: employee,
  });
});

// @desc   Delete an Employee
// @route  DELETE /api/employees/:id
// @access Private

exports.deleteEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(
      new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404)
    );
  }

  await employee.deleteOne();

  res.status(201).json({
    success: true,
    data: {},
  });
});
