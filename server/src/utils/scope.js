import mongoose from "mongoose";

export const isAdmin = (user) => user?.role === "ADMIN";

export const projectScopeFilter = (user) => {
  if (isAdmin(user)) return { createdBy: user._id };
  return { teamMembers: user._id };
};

export const taskScopeFilter = (user) => {
  if (isAdmin(user)) return { adminId: user._id };
  return { assignedTo: user._id };
};

export const assertObjectId = (value, label = "id") => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    const error = new Error(`Invalid ${label}`);
    error.statusCode = 400;
    throw error;
  }
};
