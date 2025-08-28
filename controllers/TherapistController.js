import expressAsyncHandler from "express-async-handler";
import Therapists, { defaultFees } from "../models/Therapists.js";
import Users from "../models/Users.js";
import Bank from "../models/Bank.js";
import Fees from "../models/Fees.js";
import Availbility from "../models/Availbility.js";
import mongoose from "mongoose";
import Workshop from "../models/Workshop.js";
export const updateprofile = expressAsyncHandler(async (req, res, next) => {
  const {
    phone,
    name,
    license_number,
    gender,
    state,
    office_address,
    year_of_exp,
    qualification,
    language_spoken,
    session_formats,
    bio,
  } = req.body;

  if (name.length < 3) {
    res.status(400);
    return next(new Error("Please enter valid name"));
  }
  if (phone.length != 10) {
    res.status(400);
    return next(new Error("Please enter valid phone"));
  }

  try {
    let newProfile = "";
    if (req.file && req.file !== null) {
      if (req.file.size > 200 * 1024) {
        res.status(400);
        return next(new Error("File size should be less than 200KB!"));
      }
      newProfile = req.file.filename;
    }

    let therapist = await Therapists.findOne({ user: req.user._id });
    therapist.license_number = license_number;
    therapist.gender = gender;
    therapist.state = state;
    therapist.office_address = office_address;
    therapist.year_of_exp = year_of_exp;
    therapist.qualification = qualification;
    therapist.language_spoken = language_spoken;
    therapist.session_formats = session_formats;
    await therapist.save();
    await Users.findByIdAndUpdate(
      req.user._id,
      {
        phone,
        name,
        bio,
        gender,
        profile: newProfile || req.user.profile
      },
      { new: true }
    );

    res.status(201).json({
      status: true,
      message: "Profile has been updated.",
      data: therapist,
    });
  } catch (err) {
    return next(new Error(err.message));
  }
});

export const updateServiceExperties = expressAsyncHandler(
  async (req, res, next) => {
    const { services, experties } = req.body;

    try {
      const updatedUser = await Therapists.findOneAndUpdate(
        { user: req.user._id },
        {
          services,
          experties,
        },
        { new: true }
      );
      if (updatedUser) {
        res.status(201).json({
          status: true,
          message: "Services and Experties has been updated.",
          data: {},
        });
      } else {
        res.status(400);
        return next(new Error("Failed to update Services and Experties"));
      }
    } catch (err) {
      return next(new Error(err.message));
    }
  }
);

export const updateAccountDetails = expressAsyncHandler(
  async (req, res, next) => {
    const { ac_name, ac_number, ifsc, upi } = req.body;

    try {
      const filter = { _id: req.user._id };
      const update = {
        $set: {
          ac_name: ac_name,
          ac_number: ac_number,
          ifsc: ifsc,
          upi: upi,
        },
      };

      const options = { upsert: true }; // upsert option
      const result = await Bank.updateOne(filter, update, options);

      if (result.upsertedCount || result.modifiedCount) {
        res.status(201).json({
          status: true,
          message: "Account details has been updated.",
          data: [],
        });
      } else {
        res.status(400);
        return next(new Error("Failed to update account details"));
      }
    } catch (err) {
      return next(new Error(err.message));
    }
  }
);

export const updateFeeDetails = expressAsyncHandler(async (req, res, next) => {
  const { fees } = req.body;
  console.log(fees)

  try {
    const filter = { user: req.user._id };
    const update = { $set: { fees: fees } };

    const result = await Therapists.updateOne(filter, update);

    if (result) {
      res.status(201).json({
        status: true,
        message: "Fee details has been updated.",
        data: [],
      });
    } else {
      res.status(400);
      return next(new Error("Failed to update fee details"));
    }
  } catch (err) {
    return next(new Error(err.message));
  }
});

export const updateAvailabilityDetails = expressAsyncHandler(
  async (req, res, next) => {
    const { schedule } = req.body;

    try {
      const isExist = await Therapists.findOne({ user: req.user._id });
      if (isExist) {
        isExist.availabilities = schedule;
        await isExist.save();
        res.status(201).json({
          status: true,
          message: "Details has been updated.",
          data: [],
        });
      } else {
        res.status(400);
        return next(new Error("Therapist not exists!"));
      }
    } catch (error) {
      res.status(400);
      return next(new Error(`Failed to update details,${error.message}`));
    }
  }
);

export const getAvailabilityDetails = expressAsyncHandler(
  async (req, res, next) => {
    try {
      const availabilityDetails = await Availbility.findOne({
        user_id: req.user._id,
      }).select("schedule");

      if (!availabilityDetails) {
        return res.status(200).json({
          status: true,
          message: "Fetched details successfully.",
          data: [],
        });
      }

      res.status(200).json({
        status: true,
        message: "Fetched details successfully.",
        data: availabilityDetails.schedule,
      });
    } catch (err) {
      return next(new Error(err.message));
    }
  }
);

export const getAccountDetails = expressAsyncHandler(async (req, res, next) => {
  try {
    const bankDetails = await Bank.findById(req.user._id).select(
      "ac_name ac_number ifsc upi -_id"
    );

    res.status(201).json({
      status: true,
      message: "Fetched details successfully.",
      data: bankDetails || [],
    });
  } catch (err) {
    return next(new Error(err.message));
  }
});

export const getFeeDetails = expressAsyncHandler(async (req, res, next) => {
  try {
    const bankDetails = await Fees.findById(req.user._id).select(
      "icv ica icip cca ccv ccip tca tcv tcip -_id"
    );

    res.status(201).json({
      status: true,
      message: "Fetched details successfully.",
      data: bankDetails || [],
    });
  } catch (err) {
    return next(new Error(err.message));
  }
});

export const getTherapists = expressAsyncHandler(async (req, res, next) => {
  try {
    const data = await Therapists.find({});

    res.status(201).json({
      message: "Fetched successfully",
      data: data,
      status: true,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Unknow error");
  }
});

export const getFilteredTherapists = expressAsyncHandler(
  async (req, res, next) => {
    let {
      page,
      pageSize,
      priority,
      profile_type,
      services,
      year_of_exp,
      language_spoken,
      qualification,
      search,
    } = req.query;
    try {
      page = parseInt(page) || 1;
      pageSize = parseInt(pageSize) || 10;
      const skip = (page - 1) * pageSize;

      const matchConditions = {
        show_to_page: 1,
      };

      if (priority && parseInt(priority) < 3 && parseInt(priority) > 0) {
        matchConditions.priority = parseInt(priority);
      }

      if (profile_type && profile_type.trim() !== "") {
        matchConditions.profile_type = profile_type;
      }

      if (year_of_exp && year_of_exp.trim() !== "") {
        matchConditions.year_of_exp = year_of_exp;
      }

      if (qualification && qualification.trim() !== "") {
        matchConditions.qualification = qualification;
      }

      if (language_spoken && language_spoken.trim() !== "") {
        const languageRegex = new RegExp(
          `(^|,)\\s*${language_spoken}\\s*(,|$)`,
          "i"
        );
        matchConditions.language_spoken = { $regex: languageRegex };
      }

      if (search && search.trim() !== "") {
        const searchRegex = new RegExp(search, "i");
        matchConditions.$or = [
          { "services.service": searchRegex },
          { experties: searchRegex },
          { state: searchRegex },
        ];
      }

      const [data, totalCount] = await Promise.all([
        Therapists.find(matchConditions)
          .skip(skip)
          .limit(pageSize)
          .select("-resume -__v -is_mail_sent -is_aproved -priority")
          .populate("user", "name phone email bio profile gender age dob"),
        Therapists.countDocuments(matchConditions),
      ]);

      res.status(200).json({
        message: "Fetched successfully",
        data,
        totalCount,
        status: true,
      });
    } catch (error) {
      res.status(400);
      throw new Error(error);
    }
  }
);

export const getProfile = expressAsyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400);
      return next(new Error("Invalid user ID format"));
    }
    const data = await Therapists.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "fees",
          localField: "_id",
          foreignField: "_id",
          as: "fees",
        },
      },
      {
        $unwind: "$fees",
      },
      {
        $lookup: {
          from: "availabilities",
          localField: "_id",
          foreignField: "user_id",
          as: "availabilities",
        },
      },
      {
        $unwind: {
          path: "$availabilities",
          preserveNullAndEmptyArrays: true, // Use this if you want to include therapists without availabilities
        },
      },
      {
        $lookup: {
          from: "workshops",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$post_by", "$$userId"] },
              },
            },
          ],
          as: "workshops",
        },
      },
      {
        $addFields: {
          workshops: {
            $ifNull: ["$workshops", []],
          },
        },
      },
      {
        $project: {
          name: 1,
          serve_type: 1,
          profile_type: 1,
          mode: 1,
          profile_code: 1,
          license_number: 1,
          gender: 1,
          state: 1,
          office_address: 1,
          year_of_exp: 1,
          qualification: 1,
          language_spoken: 1,
          session_formats: 1,
          services: 1,
          experties: 1,
          bio: 1,
          profile: 1,
          icv: "$fees.icv",
          ica: "$fees.ica",
          icip: "$fees.icip",
          cca: "$fees.cca",
          ccv: "$fees.ccv",
          ccip: "$fees.ccip",
          tca: "$fees.tca",
          tcv: "$fees.tcv",
          tcip: "$fees.tcip",
          schedule: "$availabilities.schedule", // Include schedule in the projection
          userWorkshop: "$workshops",
        },
      },
    ]);

    res.status(200).json({
      message: "Fetched successfully",
      data: data,
      status: true,
    });
  } catch (error) {
    res.status(400);
    throw new Error(`Unknow error`);
  }
});

export const checkProfileSet = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  try {
    const data = await Therapists.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "fees",
          localField: "_id",
          foreignField: "_id",
          as: "fees",
        },
      },
      {
        $unwind: "$fees",
      },
      {
        $lookup: {
          from: "availabilities",
          localField: "_id",
          foreignField: "user_id",
          as: "availabilities",
        },
      },
      {
        $unwind: {
          path: "$availabilities",
          preserveNullAndEmptyArrays: true, // Use this if you want to include therapists without availabilities
        },
      },
      {
        $project: {
          services: 1,
          experties: 1,
          icv: "$fees.icv",
          ica: "$fees.ica",
          icip: "$fees.icip",
          cca: "$fees.cca",
          ccv: "$fees.ccv",
          ccip: "$fees.ccip",
          tca: "$fees.tca",
          tcv: "$fees.tcv",
          tcip: "$fees.tcip",
          schedule: "$availabilities.schedule", // Include schedule in the projection
        },
      },
    ]);

    let check = true;

    if (data && data.length > 0) {
      let userData = data[0];

      const userDetailsEmpty =
        !userData.ica &&
        !userData.icip &&
        !userData.icv &&
        !userData.tca &&
        !userData.tcip &&
        !userData.tcv &&
        !userData.cca &&
        !userData.ccip &&
        !userData.ccv;

      const servicesEmpty = userData.services == null;

      const scheduleEmpty = userData.schedule.length === 0;

      if (userDetailsEmpty || servicesEmpty || scheduleEmpty) {
        check = false;
      }
    }

    res.status(200).json({
      message: "Fetched successfully",
      data: { check },
      status: true,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});
export const getTherapist = expressAsyncHandler(async (req, res, next) => {
  const user = req.user;

  try {
    const userExists = await Therapists.findOne({ user: user._id })
      .select("-_id -resume -__v -is_mail_sent")
      .populate("user", "name phone email bio profile age gender dob");
    res.status(201).json({
      message: "Fetched successfully",
      data: userExists || {},
      status: true,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error?.message || "Unknown Error");
  }
});

export const getDashboardData = expressAsyncHandler(async (req, res, next) => {
  const user = req.user;

  try {
    const workshopCount = await Workshop.countDocuments({
      post_by: user._id,
      is_active: 1,
    });
    res.status(201).json({
      message: "Fetched successfully",
      data: {
        workshops: workshopCount,
        appointments: [],
        revenue: [],
        client: [],
      },
      status: true,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Unknow error");
  }
});
