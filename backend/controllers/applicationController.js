// controllers/applicationController.js
import Application from "../models/Application.js";

export const getApplications = async (req, res) => {
  try {
    const { status, sort = "desc" } = req.query;
    const filter = { userId: req.user._id };

    if (status) {
      filter.status = status;
    }

    const apps = await Application.find(filter).sort({ dateApplied: sort === "asc" ? 1 : -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching applications." });
  }
};

export const addApplication = async (req, res) => {
  try {
    const { company, role, status, notes, dateApplied } = req.body;

    if (!company || !role || !status || !dateApplied) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    const newApp = await Application.create({
      userId: req.user._id,
      company,
      role,
      status,
      notes: notes || "Nothing",
      dateApplied,
    });

    res.status(201).json(newApp);
  }
   catch(error) {
    console.error("Add Application Error:", error);
    res.status(500).json({ message: "Server error while adding application." });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);

    if (!app) return res.status(404).json({ message: "Application not found." });

    if (app.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const updated = await Application.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update application." });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);

    if (!app) return res.status(404).json({ message: "Application not found." });

    if (app.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete application." });
  }
};
