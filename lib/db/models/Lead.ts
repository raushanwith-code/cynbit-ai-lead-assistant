import mongoose, { Schema, Document, Model } from "mongoose";
import { ILead } from "@/types";

export interface ILeadDocument extends Omit<ILead, "_id" | "id">, Document {}

const LeadSchema: Schema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Lead email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    businessType: {
      type: String,
      required: [true, "Business type is required"],
      default: "Startup",
    },
    budget: {
      type: String,
      required: [true, "Budget is required"],
    },
    budgetAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    timeline: {
      type: String,
      required: [true, "Timeline is required"],
      default: "1-2 Months",
    },
    projectRequirement: {
      type: String,
      required: [true, "Project requirement is required"],
    },
    message: {
      type: String,
      default: "",
    },
    serviceRecommended: {
      type: String,
      enum: [
        "AI Automation",
        "Web Development",
        "Mobile App Development",
        "Cloud Solutions",
        "Technical Consulting",
      ],
      required: true,
    },
    leadScore: {
      type: String,
      enum: ["High", "Medium", "Low"],
      required: true,
      index: true,
    },
    scoreValue: {
      type: Number,
      default: 75,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Proposal Sent", "Qualified", "Closed"],
      default: "New",
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    aiAnalysis: {
      rationale: { type: String, default: "" },
      keyNeeds: { type: [String], default: [] },
      suggestedTechStack: { type: [String], default: [] },
    },
    chatHistory: [
      {
        role: { type: String, enum: ["user", "assistant"], required: true },
        content: { type: String, required: true },
        timestamp: { type: String, default: () => new Date().toISOString() },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: Record<string, unknown>) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Prevent mongoose model recompilation error in Next.js hot reload
const Lead: Model<ILeadDocument> =
  mongoose.models.Lead || mongoose.model<ILeadDocument>("Lead", LeadSchema);

export default Lead;
