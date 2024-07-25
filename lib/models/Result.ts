import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
  assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  studentName: { type: String, required: false }, // Change this to false
  score: { type: Number, required: true },
  answers: [{ 
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    userAnswer: String,
    correct: Boolean
  }],
  completedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Result || mongoose.model('Result', ResultSchema);