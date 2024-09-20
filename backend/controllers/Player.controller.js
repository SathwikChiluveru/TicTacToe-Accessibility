const Player = require('../model/Player.model');

exports.createPlayer = async (req, res) => {
  const { name } = req.body;

  try {
    let player = await Player.findOne({ name });

    if (!player) {
      player = new Player({ name, history: [] });
      await player.save();
      return res.status(201).json({ message: 'Player created', player });
    }

    res.status(200).json({ message: 'Player already exists', player });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating player' });
  }
};


exports.updatePlayerHistory = async (req, res) => {
  const { name, sessionId, outcome, opponent } = req.body;

  if (!name || !sessionId || !outcome || !opponent) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const player = await Player.findOneAndUpdate(
      { name },
      { $push: { history: { sessionId, outcome, opponent } } },
      { new: true }
    );

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.status(200).json({ message: 'Player history updated', player });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating player history' });
  }
};

  
exports.getPlayerHistory = async (req, res) => {
  const { name } = req.params;

  try {
    const player = await Player.findOne({ name });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const history = player.history.map(item => ({
      sessionId: item.sessionId,
      outcome: item.outcome,
      opponent: item.opponent
    }));

    res.status(200).json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching player history' });
  }
};

  
