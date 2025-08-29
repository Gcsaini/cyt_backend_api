import expressAsyncHandler from "express-async-handler";
import Joi from "joi";
import mongoose from "mongoose";
import Workshop from "../models/Workshop.js";

export const CreateWorkshop = expressAsyncHandler(async (req, res, next) => {
  const workshopSchema = Joi.object({
    title: Joi.string().required().messages({
      "string.base": "Title should be a type of text",
      "string.empty": "Title cannot be an empty field",
      "any.required": "Title is a required field",
    }),
    category: Joi.string().required().messages({
      "string.base": "Category should be a type of text",
      "string.empty": "Category cannot be an empty field",
      "any.required": "Category is a required field",
    }),
    short_desc: Joi.string().required().messages({
      "string.base": "Short description should be a type of text",
      "string.empty": "Short description cannot be an empty field",
      "any.required": "Short description is a required field",
    }),
    desc: Joi.string().required().messages({
      "string.base": "Description should be a type of text",
      "string.empty": "Description cannot be an empty field",
      "any.required": "Description is a required field",
    }),
    level: Joi.string().required().messages({
      "string.base": "Level should be a type of text",
      "string.empty": "Level cannot be an empty field",
      "any.required": "Level is a required field",
    }),
    language: Joi.string().required().messages({
      "string.base": "Language should be a type of text",
      "string.empty": "Language cannot be an empty field",
      "any.required": "Language is a required field",
    }),
    event_date: Joi.date().required().messages({
      "date.base": "Event date should be a valid date",
      "date.empty": "Event date cannot be an empty field",
      "any.required": "Event date is a required field",
    }),
    event_end_date: Joi.date().required().messages({
      "date.base": "Event End date should be a valid date",
      "date.empty": "Event End date cannot be an empty field",
      "any.required": "Event End date is a required field",
    }),
    mrp: Joi.number().required().messages({
      "number.base": "MRP should be a number",
      "number.empty": "MRP cannot be an empty field",
      "any.required": "MRP is a required field",
    }),
    price: Joi.number().required().messages({
      "number.base": "Price should be a number",
      "number.empty": "Price cannot be an empty field",
      "any.required": "Price is a required field",
    }),
    event_time: Joi.string().required().messages({
      "string.base": "Event Time should be a type of text",
      "string.empty": "Event Time cannot be an empty field",
      "any.required": "Event Time is a required field",
    }),
    duration: Joi.string().required().messages({
      "string.base": "Duration should be a type of text",
      "string.empty": "Duration cannot be an empty field",
      "any.required": "Duration is a required field",
    }),
  }).unknown(true);

  const { error } = workshopSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  const {
    title,
    short_desc,
    level,
    language,
    event_date,
    event_end_date,
    mrp,
    price,
    desc,
    category,
    event_time,
    duration,
  } = req.body;

  try {
    const imagefile = req.files["image"] ? req.files["image"][0] : null;
    console.log("filenameee", req.files);
    console.log("filenameee", imagefile);
    const pdffile = req.files["pdf"] ? req.files["pdf"][0] : null;

    if (!imagefile || !pdffile) {
      return res
        .status(400)
        .json({ message: "Both image and PDF files are required." });
    }
    const MAX_IMAGE_SIZE = 1 * 1024 * 1024;
    const MAX_PDF_SIZE = 5 * 1024 * 1024;
    let workshop_image = null;
    let content_pdf = null;

    if (imagefile.size > MAX_IMAGE_SIZE) {
      res.status(400);
      throw new Error(
        `Image file size should not exceed ${MAX_IMAGE_SIZE / (1024 * 1024)
        } MB.`
      );
    } else {
      workshop_image = imagefile.filename;
    }

    if (pdffile.size > MAX_PDF_SIZE) {
      res.status(400);
      throw new Error(
        `PDF file size should not exceed ${MAX_PDF_SIZE / (1024 * 1024)} MB.`
      );
    } else {
      content_pdf = pdffile.filename;
    }

    let post_by = req.user._id;
    const savedWorkshop = await Workshop.create({
      post_by,
      title,
      category,
      short_desc,
      level,
      language,
      event_date,
      event_end_date,
      mrp,
      price,
      desc,
      event_time,
      duration,
      workshop_image,
      content_pdf,
      reviews: [],
    });

    if (savedWorkshop) {
      res.status(201).json({
        message: "Workshop created successfully.",
        data: {},
        status: true,
      });
    } else {
      res.status(400);
      throw new Error("Failed to create workshop.");
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const UpdateWorkshop = expressAsyncHandler(async (req, res, next) => {
  const workshopSchema = Joi.object({
    title: Joi.string().required().messages({
      "string.base": "Title should be a type of text",
      "string.empty": "Title cannot be an empty field",
      "any.required": "Title is a required field",
    }),
    category: Joi.string().required().messages({
      "string.base": "Category should be a type of text",
      "string.empty": "Category cannot be an empty field",
      "any.required": "Category is a required field",
    }),
    short_desc: Joi.string().required().messages({
      "string.base": "Short description should be a type of text",
      "string.empty": "Short description cannot be an empty field",
      "any.required": "Short description is a required field",
    }),
    desc: Joi.string().required().messages({
      "string.base": "Description should be a type of text",
      "string.empty": "Description cannot be an empty field",
      "any.required": "Description is a required field",
    }),
    level: Joi.string().required().messages({
      "string.base": "Level should be a type of text",
      "string.empty": "Level cannot be an empty field",
      "any.required": "Level is a required field",
    }),
    language: Joi.string().required().messages({
      "string.base": "Language should be a type of text",
      "string.empty": "Language cannot be an empty field",
      "any.required": "Language is a required field",
    }),
    event_date: Joi.date().required().messages({
      "date.base": "Event date should be a valid date",
      "date.empty": "Event date cannot be an empty field",
      "any.required": "Event date is a required field",
    }),
    event_end_date: Joi.date().required().messages({
      "date.base": "Event End date should be a valid date",
      "date.empty": "Event End date cannot be an empty field",
      "any.required": "Event End date is a required field",
    }),
    mrp: Joi.number().required().messages({
      "number.base": "MRP should be a number",
      "number.empty": "MRP cannot be an empty field",
      "any.required": "MRP is a required field",
    }),
    price: Joi.number().required().messages({
      "number.base": "Price should be a number",
      "number.empty": "Price cannot be an empty field",
      "any.required": "Price is a required field",
    }),
    event_time: Joi.string().required().messages({
      "string.base": "Event Time should be a type of text",
      "string.empty": "Event Time cannot be an empty field",
      "any.required": "Event Time is a required field",
    }),
    duration: Joi.string().required().messages({
      "string.base": "Duration should be a type of text",
      "string.empty": "Duration cannot be an empty field",
      "any.required": "Duration is a required field",
    }),
  }).unknown(true);

  const { error } = workshopSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  const {
    title,
    short_desc,
    level,
    language,
    event_date,
    event_end_date,
    mrp,
    price,
    desc,
    workshopId,
    category,
    event_time,
    duration,
  } = req.body;

  try {
    const isExists = await Workshop.findById(workshopId);
    if (!isExists) {
      res.status(400);
      throw new Error("No workshop found.");
    }
    const imagefile = req.files?.image?.[0] || null;
    const pdffile = req.files?.pdf?.[0] || null;

    const MAX_IMAGE_SIZE = 1 * 1024 * 1024;
    const MAX_PDF_SIZE = 5 * 1024 * 1024;
    let workshop_image = isExists.workshop_image;
    let content_pdf = isExists.content_pdf;

    if (imagefile) {
      if (imagefile.size > MAX_IMAGE_SIZE) {
        return res.status(400).json({
          message: `Image file size should not exceed ${MAX_IMAGE_SIZE / (1024 * 1024)} MB.`,
          status: false,
        });
      }
      workshop_image = imagefile.filename;
    }
    if (pdffile) {
      if (pdffile.size > MAX_PDF_SIZE) {
        return res.status(400).json({
          message: `PDF file size should not exceed ${MAX_PDF_SIZE / (1024 * 1024)} MB.`,
          status: false,
        });
      }
      content_pdf = pdffile.filename;
    }

    const updatedWorkShop = await Workshop.findByIdAndUpdate(
      workshopId,
      {
        title,
        category,
        short_desc,
        level,
        language,
        event_date,
        event_end_date,
        mrp,
        price,
        desc,
        event_time,
        duration,
        workshop_image,
        content_pdf,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Workshop updated successfully.",
      data: updatedWorkShop,
      status: true,
    });

  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const CreateReview = expressAsyncHandler(async (req, res, next) => {
  const reviewSchema = Joi.object({
    name: Joi.string().email().required(),
    profile: Joi.string().email().required(),
    star: Joi.string()
      .length(1)



      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.pattern.base": "Please enter valid number.",
      }),
    review: Joi.string().required().messages({
      "string.base": "Review should be a type of text",
      "string.empty": "Review cannot be an empty field",
      "any.required": "Review is a required field",
    }),
  });
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    return next(error);
  }

  const workshopId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(workshopId)) {
    return res.status(400).json({
      status: false,
      message: "Invalid workshop ID.",
    });
  }

  const { name, image, review, star } = req.body;

  try {
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({
        status: false,
        message: "Workshop not found.",
      });
    }

    const newReview = { name, image, review, star };
    workshop.reviews.push(newReview);

    const updatedWorkshop = await workshop.save();

    res.status(201).json({
      status: true,
      message: "Review added successfully.",
      data: updatedWorkshop,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const GetWorkshops = expressAsyncHandler(async (req, res, next) => {
  try {
    let { page, pageSize } = req.query;
    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 6;
    const skip = (page - 1) * pageSize;
    const limit = pageSize;
    const workshops = await Workshop.find({
      post_by: req.user._id,
    })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
    res.status(201).json({
      message: "Fetched successfully",
      data: workshops || [],
      status: true,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Unknow error");
  }
});

export const DisableWorkshop = expressAsyncHandler(async (req, res, next) => {
  try {
    let { is_active, id } = req.query;
    const workshop = await Workshop.findById(id);
    if (workshop) {
      workshop.is_active = is_active;
      await workshop.save();
      res.status(201).json({
        message: "Updated successfully",
        data: {},
        status: true,
      });
    } else {
      res.status(400);
      throw new Error("Workshop not found.");
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

export const DeleteWorkshop = expressAsyncHandler(async (req, res, next) => {
  try {
    let { id } = req.query;
    const workshop = await Workshop.findByIdAndDelete(id);
    if (workshop) {
      res.status(200).json({
        message: "Deleted successfully",
        data: {},
        status: true,
      });
    } else {
      res.status(400);
      throw new Error("Workshop not found.");
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const GetWorkshop = expressAsyncHandler(async (req, res, next) => {
  try {
    let { workshopId } = req.params;
    const workshop = await Workshop.findById(workshopId);
    res.status(201).json({
      message: "Fetched successfully",
      data: workshop || [],
      status: true,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Unknow error");
  }
});

export const GetWorkshopWeb = expressAsyncHandler(async (req, res, next) => {
  try {
    let { workshopId } = req.params;
    const workshop = await Workshop.findById(workshopId).populate(
      "post_by",
      "name profile profile_type bio experties"
    );
    if (workshop) {
      const moreWorkshopsByThisUser = await Workshop.find({
        post_by: workshop.post_by._id,
        _id: { $ne: workshop._id },
      });
      const similarWorkshop = await Workshop.find({
        post_by: { $ne: workshop.post_by._id },
      });
      res.status(201).json({
        message: "Fetched successfully",
        data: workshop,
        workshopByThisUser: moreWorkshopsByThisUser || [],
        similarWorkshop: similarWorkshop || [],
        status: true,
      });
    } else {
      res.status(201).json({
        message: "Fetched successfully",
        data: [],
        workshopByThisUser: [],
        similarWorkshop: [],
        status: true,
      });
    }
  } catch (error) {
    res.status(400);
    throw new Error("Unknow error");
  }
});

export const GetWorkshopsWeb = expressAsyncHandler(async (req, res, next) => {
  let { level, language, category, search } = req.query;
  try {
    const matchConditions = {
      is_active: 1,
    };

    if (level && level.trim() !== "") {
      matchConditions.level = level;
    }

    if (language && language.trim() !== "") {
      matchConditions.language = language;
    }

    if (category && category.trim() !== "") {
      matchConditions.category = category;
    }

    if (search && search.trim() !== "") {
      const nameRegex = new RegExp(search, "i");
      matchConditions.title = { $regex: nameRegex };
    }

    const currentDateISO = new Date().toISOString().slice(0, 10);
    matchConditions.event_date = { $gt: currentDateISO };

    const data = await Workshop.find(matchConditions);

    res.status(200).json({
      message: "Fetched successfully",
      data: data,
      status: true,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});
