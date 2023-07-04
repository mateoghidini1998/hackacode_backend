const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Ticket = require('../models/Ticket');
const Customer = require('../models/Customer');
const Game = require('../models/Game');

//@desc   Create a Ticket
//@route  POST /api/v1/tickets
//@access Private

exports.createTicket = asyncHandler(async (req, res, next) => {
  const { customerId, gameId, dueDate } = req.body;
  const customer = await Customer.findById(customerId);
  const game = await Game.findById(gameId);

  //Check if customer and game exist
  if (!customer) {
    return next(
      new ErrorResponse(`Customer with id ${customerId} not found`, 404)
    );
  } else if (!game) {
    return next(new ErrorResponse(`Game with id ${gameId} not found`, 404));
  }

  //Obtaining the game hours
  const gameHours = game.hours;

  //Check if the ticket dueDate is valid.
  let isDueDateValid = false;

  for (const hours of gameHours) {
    //Get the opening and closing hours for each hours item
    const openingHour = new Date(hours.opening);
    const closingHour = new Date(hours.closing);
    //Generate a date object for dueDate
    const dueDateObj = new Date(dueDate);

    //Check if the dueDate is within the hours range
    if (dueDateObj >= openingHour && dueDateObj <= closingHour) {
      isDueDateValid = true;
      break;
    }
  }

  if (!isDueDateValid) {
    return next(
      new ErrorResponse('Due date is not within the game hours range', 400)
    );
  }

  const ticket = await Ticket.create({
    customer,
    game,
    dueDate,
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
