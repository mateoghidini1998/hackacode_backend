const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');
const Sale = require('../models/Sale');
const Ticket = require('../models/Ticket');

//@desc   Create a Sale
//@method POST
//@access Private

exports.createSale = asyncHandler(async (req, res, next) => {
  const { tickets } = req.body;
  console.log(tickets);

  const ticketsFound = await Ticket.find({ _id: { $in: tickets } }).populate(
    'game'
  );
  console.log(ticketsFound);

  //Calculate Total Amount for a Sale
  const total = ticketsFound.reduce((sum, ticket) => {
    const price = ticket.game.price;
    console.log(`Ticket ID: ${ticket._id}, Price: ${price}`);
    return sum + price;
  }, 0);

  const sale = await Sale.create({ tickets, total });

  res.status(201).json({
    success: true,
    data: sale,
  });
});

//@desc   Get all sales
//@method GET
//@access Private

exports.getSales = asyncHandler(async (req, res, next) => {
  const sales = await Sale.find();

  if (!sales) {
    return next(new ErrorResponse(`No sales found`));
  }

  res.status(200).json({
    success: true,
    count: sales.length,
    data: sales,
  });
});

//@desc   Get a sales
//@method GET
//@access Private

exports.getSale = asyncHandler(async (req, res, next) => {
  const sale = await Sale.findById(req.params.id);

  if (!sale)
    return next(
      new ErrorResponse(`Sale not found with id of ${req.params.id}`)
    );

  res.status(200).json({
    success: true,
    sale,
  });
});

//@desc   Update a sale
//@method PUT
//@access Private

exports.updateSale = asyncHandler(async (req, res, next) => {
  const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!sale) {
    return next(
      new ErrorResponse(`Sale not found with id of ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    data: sale,
  });
});

//@desc    Delete a Sale
//@method  DELETE
//@access  Private

exports.deleteSale = asyncHandler(async (req, res, next) => {
  const sale = await Sale.findByIdAndDelete(req.params.id);

  if (!sale) {
    return next(
      new ErrorResponse(`Sale not found with id of ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});

//@desc      Get the total amount of all sales in a month and year
//@method    GET
//@access    Private

exports.getTotalSales = asyncHandler(async (req, res, next) => {
  const { month, year } = req.query;

  //Create a range of dates by providing an year and a month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  //Find all sales within the range of dates
  const sales = await Sale.find({
    createdAt: { $gte: startDate, $lte: endDate },
  });

  if (!sales) {
    return next(new ErrorResponse(`No sales found`));
  }

  //Calculate total
  let total = 0;
  sales.forEach((sale) => {
    console.log(typeof sale.total, sale.total);
    total += sale.total;
  });

  res.status(200).json({
    success: true,
    total,
  });
});

//@desc     Get the total amount from all Sales for an specific Date
//@method   GET
//@access   Private

exports.getTotalSalesByDate = asyncHandler(async (req, res, next) => {
  const { day, month, year } = req.query;

  // Set starting date to be the 00:00:00 of the day and end date to be the 23:59:59 of the day
  const startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
  const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);

  const sales = await Sale.find({
    createdAt: { $gte: startDate, $lte: endDate },
  });

  //Calculate Total
  let total = 0;
  sales.forEach((sale) => {
    total += sale.total;
  });

  res.status(200).json({
    success: true,
    total,
  });
});
