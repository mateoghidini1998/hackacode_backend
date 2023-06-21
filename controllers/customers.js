const Customer = require('../models/Customer');
const asyncHandler = require('../middleware/async');

// @desc   Register Customer
// @route  POST /api/customers/register
// @access Private

exports.register = asyncHandler(async (req, res, next) => {
    const { name, lastName, dni, email } = req.body;
    const customer = await Customer.create({
        name,
        lastName,
        dni,
        email
    });

    res.status(201).json({
        success: true,
        data: customer
    })

    

});


// @desc   Get all Customers
// @route  GET /api/customers/
// @access Public

exports.getCustomers = asyncHandler(async (req, res, next) => {
    const customers = await Customer.find();

    res.status(201).json({
        success: true,
        count: customers.length,
        data: customers
    })

});


// @desc   Get a Customer
// @route  GET /api/customers/:id
// @access Private

exports.getCustomer = asyncHandler(async (req, res, next) => {
    const customer = await Customer.findById(req.params.id);

    res.status(201).json({
        success: true,
        data: customer
    })

});

// @desc   Update a Customer
// @route  PUT /api/customers/:id
// @access Private

exports.updateCustomer = asyncHandler(async (req, res, next) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!customer){
        return next (new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404));
    }

    res.status(201).json({
        success: true,
        data: customer
    })

});


// @desc   Update a Customer
// @route  PUT /api/customers/:id
// @access Private

exports.deleteCustomer = asyncHandler(async (req, res, next) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if(!customer){
        return next (new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404));
    }

    res.status(201).json({
        success: true,
        data: {}
    })

});