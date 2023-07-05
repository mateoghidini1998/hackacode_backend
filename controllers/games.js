const Game = require('../models/Game');
const Ticket = require('../models/Ticket');
const Employee = require('../models/Employee');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');

// @desc   Create a game
// @route  POST /api/games/register
// @access Private

exports.registerGame = asyncHandler(async (req, res, next) => {
  const { name, description, employees, hours, price } = req.body;

  // Verify that the hours are valid and dont overlap
  const overlappingHours = hours.some((currentHour, currentIndex) => {
    return hours.slice(currentIndex + 1).some((nextHour) => {
      return (
        (currentHour.opening <= nextHour.opening &&
          nextHour.opening < currentHour.closing) ||
        (currentHour.opening < nextHour.closing &&
          nextHour.closing <= currentHour.closing) ||
        (nextHour.opening <= currentHour.opening &&
          currentHour.closing <= nextHour.closing)
      );
    });
  });

  if (overlappingHours) {
    return res.status(400).json({
      success: false,
      error: 'Range of hours are overlapping',
    });
  }

  // Verify that the employees exist
  const foundEmployees = await Employee.find({
    _id: { $in: employees },
  });

  const foundEmployeesIds = foundEmployees.map((f) => f._id.toString());
  const errors = [];

  for (var i = 0; i < employees.length; i++) {
    if (!foundEmployeesIds.includes(employees[i])) {
      errors.push(`Employees not found with id of ${employees[i]}`);
    } else {
      const emp = foundEmployees.find((e) => e._id.toString() === employees[i]);

      if (emp.type !== 'employee') {
        errors.push(`Employees is not a Game Employee ${employees[i]}`);
      }
    }
  }

  if (errors.length > 0) {
    return next(new ErrorResponse(errors.join(','), 404));
  }

  console.log(employees);

  const game = await Game.create({
    name,
    description,
    employees,
    hours,
    price,
  });

  res.status(201).json({
    success: true,
    data: game,
  });
});

exports.getGames = asyncHandler(async (req, res) => {
  const games = await Game.find({});

  games.forEach((game) => {
    if (game.employees.length === 0) {
      game.available = false;
    }
  });

  res.status(200).json({
    success: true,
    count: games.length,
    data: games,
  });
});

exports.getGame = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id);

  if (!game) {
    return next(
      new ErrorResponse(`Game not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: game,
  });
});

// @desc   Upload photo to a game
// @route  PUT /api/games/:id/photo
// @access Private

exports.uploadPhoto = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id);

  if (!game) {
    return next(
      new ErrorResponse(`Game not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${game._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Game.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

//@desc Update a game
// @route  PUT /api/games/:id
// @access Private

exports.updateGame = asyncHandler(async (req, res, next) => {
  const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!game) {
    return next(
      new ErrorResponse(`Game not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: game,
  });
});

//@desc Delete a game
// @route  DELETE /api/games/:id
// @access Private

exports.deleteGame = asyncHandler(async (req, res, next) => {
  const game = await Game.findByIdAndDelete(req.params.id);

  if (!game) {
    return next(
      new ErrorResponse(`Game not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    success: true,
    data: {},
  });
});

//@desc      Get the Game that with the most tickets sold until a date
//@method    GET /api/games/most-tickets
//@access    Private

exports.mostTickets = asyncHandler(async (req, res, next) => {
  const currentDate = new Date();

  // Get the current date
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();

  const endDate = new Date(year, month, day, 23, 59, 59, 999);

  //Make a left join within the tickets property Game and the _id Of the Game and create a Tickets array
  const games = await Game.aggregate([
    {
      $lookup: {
        from: 'tickets',
        localField: '_id',
        foreignField: 'game',
        as: 'tickets',
      },
    },
    //Make a response by showing the id, name of the customer
    //and amount of tickets in a specific month and year for
    {
      $project: {
        _id: 1,
        name: 1,
        ticketCount: {
          $size: {
            //Filter tickets and create a new array that contains only the tickets within the range of dates
            $filter: {
              input: '$tickets',
              as: 'ticket',
              cond: {
                $and: [{ $lte: ['$$ticket.createdAt', endDate] }],
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

  if (games.length === 0) {
    return res.status(404).json({
      success: false,
      error: `No games found for the specified date ${endDate}`,
    });
  }

  const game = games[0];

  res.status(200).json({
    success: true,
    data: game,
  });
});

//@desc      Get all the amount of tickets sold for all games in an specific Date
//@method    GET api/games/tickets-sold?year={year}&month={month}&day={day}
//@access    Private

exports.ticketsSoldByDate = asyncHandler(async (req, res, next) => {
  const { day, month, year } = req.query;

  //Set starting date to be the 00:00:00 of the day and end date to be the 23:59:59 of the day
  const startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
  const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);

  const ticketsCount = await Game.aggregate([
    {
      $lookup: {
        from: 'tickets',
        localField: '_id',
        foreignField: 'game',
        as: 'tickets',
      },
    },
    {
      $match: {
        'tickets.createdAt': {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        ticketsCount: { $sum: { $size: '$tickets' } },
      },
    },
  ]);

  const ticketsSold =
    ticketsCount.length > 0 ? ticketsCount[0].ticketsCount : 0;

  if (!ticketsCount) {
    return next(
      new ErrorResponse(
        `No tickets sold for the specified date ${endDate}`,
        404
      )
    );
  }

  res.json({
    success: true,
    data: ticketsSold,
  });
});

//@desc      Get all the amount of tickets sold for a game in an specific Date
//@method    GET api/games/:id/tickets-sold?year={year}&month={month}&day={day}
//@access    Private

exports.ticketsByAGame = asyncHandler(async (req, res, next) => {
  const { day, month, year } = req.query;

  // Set starting date to be the 00:00:00 of the day and end date to be the 23:59:59 of the day
  const startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
  const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);

  const ticketsCount = await Ticket.countDocuments({
    game: req.params.id,
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  if (ticketsCount === 0) {
    return next(
      new ErrorResponse(
        `No tickets sold for the specified date ${endDate} and Game ${req.params}`,
        404
      )
    );
  }

  res.json({
    success: true,
    data: ticketsCount,
  });
});
