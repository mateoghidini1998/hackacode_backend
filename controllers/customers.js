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
    email,
  });

  res.status(201).json({
    success: true,
    data: customer,
  });
});

// @desc   Get all Customers
// @route  GET /api/customers/
// @access Public

exports.getCustomers = asyncHandler(async (req, res, next) => {
  const customers = await Customer.find();

  res.status(201).json({
    success: true,
    count: customers.length,
    data: customers,
  });
});

// @desc   Get a Customer
// @route  GET /api/customers/:id
// @access Private

exports.getCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  res.status(201).json({
    success: true,
    data: customer,
  });
});

// @desc   Update a Customer
// @route  PUT /api/customers/:id
// @access Private

exports.updateCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!customer) {
    return next(
      new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    success: true,
    data: customer,
  });
});

// @desc   Update a Customer
// @route  PUT /api/customers/:id
// @access Private

exports.deleteCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer) {
    return next(
      new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    success: true,
    data: {},
  });
});

//@desc      Get the Customer that bought the most tickets in a specific month and year
//@method    GET /api/customers/most-tickets
//@access    Private

exports.mostTickets = asyncHandler(async (req, res, next) => {
  const { year, month } = req.query;

  //Create a range of dates by providing an year and a month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  //Make a left join within the tickets property Customer and the _id Of the Customer and create a Tickets array
  const customers = await Customer.aggregate([
    {
      $lookup: {
        from: 'tickets',
        localField: '_id',
        foreignField: 'customer',
        as: 'tickets',
      },
    },
    //Make a response by showing the id, name of the customer
    //and amount of tickets in a specific month and year for
    {
      $project: {
        _id: 1,
        name: 1,
        lastName: 1,
        dni: 1,
        ticketCount: {
          $size: {
            //Filter tickets and create a new array that contains only the tickets within the range of dates
            $filter: {
              input: '$tickets',
              as: 'ticket',
              cond: {
                $and: [
                  { $gte: ['$$ticket.createdAt', startDate] },
                  { $lte: ['$$ticket.createdAt', endDate] },
                ],
              },
            },
          },
        },
      },
    },
    {
      $sort: { ticketCount: -1 },
    },
    {
      $limit: 1,
    },
  ]);

  if (customers.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'No customers found for the specified month and year',
    });
  }

  const customer = customers[0];

  res.status(200).json({
    success: true,
    data: customer,
  });
});
