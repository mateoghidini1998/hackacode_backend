const Game = require('../models/Game');
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
