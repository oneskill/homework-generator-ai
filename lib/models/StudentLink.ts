import mongoose from 'mongoose';

const StudentLinkSchema = new mongoose.Schema({
  assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  studentName: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  usedAt: { type: Date },
});

export default mongoose.models.StudentLink || mongoose.model('StudentLink', StudentLinkSchema);