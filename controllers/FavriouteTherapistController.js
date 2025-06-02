import expressAsyncHandler from "express-async-handler";
import FavoriteTherapist from "../models/FavriouteTherapist.js";
import mongoose from "mongoose";

export const insertFavriouteTherapist = expressAsyncHandler(
  async (req, res, next) => {
    const { therapistId } = req.body;
    const userId = req.user._id;

    try {
      if (!mongoose.Types.ObjectId.isValid(therapistId)) {
        res.status(400);
        return next(new Error("Invalid ID provided"));
      }
      let favorite = await FavoriteTherapist.findOne({ userId });
      if (!favorite) {
        favorite = new FavoriteTherapist({
          userId,
          therapists: [therapistId],
        });
      } else {
        if (!favorite.therapists.includes(therapistId)) {
          favorite.therapists.push(therapistId);
        }
      }
      await favorite.save();
      res.status(201).json({
        message: "Saved successfully.",
        data: {},
        status: true,
      });
    } catch (error) {
      res.status(400);
      throw new Error("Failed to add favorite therapist.");
    }
  }
);

export const removeFavriouteTherapist = expressAsyncHandler(
  async (req, res, next) => {
    const { therapistId } = req.body;
    const userId = req.user._id;

    try {
      if (!mongoose.Types.ObjectId.isValid(therapistId)) {
        res.status(400);
        return next(new Error("Invalid ID provided"));
      }
      let favorite = await FavoriteTherapist.findOne({ userId });
      if (favorite) {
        favorite.therapists = favorite.therapists.filter(
          (id) => id.toString() !== therapistId
        );
        await favorite.save();
        res.status(201).json({
          message: "Removed successfully",
          data: {},
          status: true,
        });
      } else {
        res.status(400);
        return next(new Error("Favorite Therapist not found."));
      }
    } catch (error) {
      res.status(400);
      throw new Error("Failed to remove favorite therapist.");
    }
  }
);

export const getFavriouteTherapists = expressAsyncHandler(
  async (req, res, next) => {
    const userId = req.user._id;
    const {
      profile_type,
      services,
      year_of_exp,
      language_spoken,
      qualification,
      search,
      page = 1,
      limit = 10,
    } = req.body;

    const query = {};

    if (profile_type) {
      query.profile_type = profile_type;
    }

    if (services) {
      query.services = { $regex: services, $options: "i" }; // Partial match, case-insensitive
    }

    if (year_of_exp) {
      query.year_of_exp = year_of_exp;
    }

    if (language_spoken) {
      query.language_spoken = { $regex: language_spoken, $options: "i" }; // Partial match, case-insensitive
    }

    if (qualification) {
      query.qualification = { $regex: qualification, $options: "i" }; // Partial match, case-insensitive
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { profile_type: { $regex: search, $options: "i" } },
        { services: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (page - 1) * limit;
    try {
      const favorite = await FavoriteTherapist.findOne({ userId }).populate(
        "therapists"
      );

      if (!favorite) {
        res.status(201).json({
          message: "Success",
          data: {},
          status: true,
        });
      }

      // Filter therapists based on the query
      const filteredTherapists = favorite.therapists.filter((therapist) => {
        for (let key in query) {
          if (key === "$or") {
            if (
              !query.$or.some((condition) => {
                for (let field in condition) {
                  if (condition[field].$regex.test(therapist[field])) {
                    return true;
                  }
                }
                return false;
              })
            ) {
              return false;
            }
          } else {
            if (!query[key].$regex.test(therapist[key])) {
              return false;
            }
          }
        }
        return true;
      });

      const paginatedTherapists = filteredTherapists.slice(
        skip,
        skip + parseInt(limit)
      );

      if (favorite) {
        res.status(201).json({
          message: "Success",
          data: paginatedTherapists,
          totalPages: Math.ceil(filteredTherapists.length / limit),
          currentPage: parseInt(page),
          status: true,
        });
      } else {
        res.status(201).json({
          message: "Removed successfully",
          data: {},
          status: true,
        });
      }
    } catch (error) {
      res.status(400);
      throw new Error(error);
    }
  }
);

export const getFavriouteTherapistsList = expressAsyncHandler(
  async (req, res, next) => {
    const userId = req.user._id;

    try {
      const favorite = await FavoriteTherapist.findOne({ userId });

      if (!favorite) {
        res.status(201).json({
          message: "Success",
          data: {},
          status: false,
        });
      } else {
        res.status(201).json({
          message: "Success",
          data: favorite,
          status: true,
        });
      }
    } catch (error) {
      res.status(400);
      throw new Error(error);
    }
  }
);
