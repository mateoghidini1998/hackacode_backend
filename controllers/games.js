const Game = require('../models/Game');
const Employee = require('../models/Employee');
const asyncHandler = require('../middleware/async');

// @desc   Create a game
// @route  POST /api/games/register
// @access Private

exports.registerGame = asyncHandler(async (req, res) => {
    const { name, employees, hours } = req.body;
  
    // Verify that the hours are valid and dont overlap
    const overlappingHours = hours.some((currentHour, currentIndex) => {
      return hours.slice(currentIndex + 1).some((nextHour) => {
        return (
          (currentHour.opening <= nextHour.opening && nextHour.opening < currentHour.closing) ||
          (currentHour.opening < nextHour.closing && nextHour.closing <= currentHour.closing) ||
          (nextHour.opening <= currentHour.opening && currentHour.closing <= nextHour.closing)
        );
      });
    });
  
    if (overlappingHours) {
      return res.status(400).json({
        success: false,
        error: "Range of hours are overlapping",
      });
    }
  
    const game = await Game.create({
      name,
      employees,
      hours,
    });
  
    res.status(201).json({
      success: true,
      data: game,
    });
  });
  

exports.getGames = asyncHandler(async (req, res) => {
    const games = await Game.find({});

    res.status(200).json({
        success: true,
        count: games.length,
        data: games
    })
})
