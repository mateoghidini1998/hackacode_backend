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
  const sale = await Sale.create(req.body);

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
