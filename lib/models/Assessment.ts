import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mcq', 'truefalse', 'fillintheblank'],
    required: true,
  },
  question: { type: String, required: true },
  options: [String],
  correctAnswer: { type: String, required: true },
});

const AssessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: Number, required: true },
  difficulty: { type: String, required: true },
  language: { type: String, required: true },
  numberOfQuestions: { type: Number, required: true },
  vocabularyList: String,
  topic: { type: String, required: true },
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Assessment || mongoose.model('Assessment', AssessmentSchema);