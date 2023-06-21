const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Ticket = require('../models/Ticket');
const Customer = require('../models/Customer');
const Game = require('../models/Game');

//@desc   Create a Ticket
//@route  POST /api/v1/tickets
//@access Private

exports.createTicket = asyncHandler(async (req, res, next) => {
  const { customer, game } = req.body;
  const customerId = await Customer.findById(customer);
  const gameId = await Game.findById(game);

  //Check if customer and game exist
  if (!customerId) {
    return next(
      new ErrorResponse(`Customer with id ${customerId} not found`, 404)
    );
  } else if (!gameId) {
    return next(new ErrorResponse(`Game with id ${gameId} not found`, 404));
  }

  const ticket = await Ticket.create({
    customer,
    game,
  });

  res.status(201).json({
    success: true,
    data: ticket,
  });
});

//@desc   Get all Tickets
//@route  GET /api/v1/tickets
//@access Private

exports.getTickets = asyncHandler(async (req, res, next) => {
  const tickets = await Ticket.find();

  res.status(200).json({
    success: true,
    count: tickets.length,
    data: tickets,
  });
});

//@desc   Get a Ticket
//@route  GET /api/v1/tickets/:id
//@access Private

exports.getTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(
      new ErrorResponse(`Ticket with id ${req.params.id} not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: ticket,
  });
});

//@desc   Update a Ticket
//@method PUT /api/v1/tickets/:id
//@access Private

exports.updateTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!ticket) {
    return next(
      new ErrorResponse(`Ticket with id ${req.params.id} not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: ticket,
  });
});

//@desc   Delete a Ticket
//@method DELETE /api/v1/tickets/:id
//@access Private

exports.deleteTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findByIdAndDelete(req.params.id);

  if (!ticket) {
    return next(
      new ErrorResponse(`Ticket with id ${req.params.id} not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});
