import expressAsyncHandler from "express-async-handler";

export const GetServerTime = expressAsyncHandler(async (req, res, next) => {
  res.status(201).json(Math.floor(Date.now() / 1000));
});
