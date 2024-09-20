const mongoose = require('mongoose')

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  history: [
    {
      sessionId: { type: String, required: true },
      outcome: { type: String, enum: ['win', 'lose', 'draw'], required: true },
      opponent: { type: String, required: true },
    },
  ],
});

const Player = mongoose.model('Player', PlayerSchema)

module.exports = Player