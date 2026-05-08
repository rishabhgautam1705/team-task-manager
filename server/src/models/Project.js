import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Planning", "In Progress", "Completed", "On Hold"],
      default: "Planning",
    },
    deadline: { type: Date, required: true },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

projectSchema.index({ createdBy: 1, status: 1 });
projectSchema.index({ teamMembers: 1 });
projectSchema.index({ deadline: 1 });
projectSchema.index({ title: "text", description: "text" });

const Project = mongoose.model("Project", projectSchema);

export default Project;
