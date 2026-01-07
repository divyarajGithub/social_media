import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import bcrypt from "bcrypt";
import { sendResponse } from "../utils/sendResponse";
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    throw new ApiError(400, "Email, username and password are required");
  }
  const isExist = await User.findOne({ email: email });
  if (isExist) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    username,
    password: hashedPassword,
  });
  sendResponse(res, 201, "User registered successfully", user);
});


export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required")
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(400, "User not found")
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid email or password");
  }
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
  res.cookie("accessToken", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  sendResponse(res, 200, "Login successful", {
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts
    },
    token,
  });

})

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "strict",
  });

  sendResponse(res, 200, "Logged out successfully");
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const data = await User.findById({ _id: userId })
  sendResponse(res, 200, "User data fetched successfully", data)
})

export const editProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  const { bio, gender, username, profilePicture } = req.body;

  const user = await User.findById(userId)
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (bio) {
    user.bio = bio
  }
  if (gender) {
    user.gender = gender
  }
  if (username) {
    user.username = username
  }
  if (profilePicture) {
    user.profilePicture = profilePicture
  }
  const updatedUser = await User.findByIdAndUpdate(userId, user, { new: true, runValidators: true }).select("-password")
  sendResponse(res, 200, "User profile updated successfully", updatedUser)

})

export const getSuggestedUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId
  const users = await User.find({ _id: { $ne: userId } })
  sendResponse(res, 200, "Suggested users fetch successfully", users)
})

export const followUnfollow = asyncHandler(async (req: Request, res: Response) => {
  console.log("api route hit" , req.body)
  const loggedInId = req.userId;
  const userIdToFollow: string = req.body.id;

  if (loggedInId === userIdToFollow) {
    throw new ApiError(400, "You can not follow yourself")
  }
  const exists = await User.exists({
    _id: userIdToFollow,
    followers: {
      $in: [new mongoose.Types.ObjectId(loggedInId)]
    }
  });
  if (exists) {
    Promise.all([User.findByIdAndUpdate(userIdToFollow, { $pull: { followers: loggedInId } }),
    User.findByIdAndUpdate(loggedInId, { $pull: { following: userIdToFollow } })])
    sendResponse(res, 200, "Unfollowed successfully")

  } else {
    Promise.all([User.findByIdAndUpdate(userIdToFollow, { $addToSet: { followers: loggedInId } }),
    User.findByIdAndUpdate(loggedInId, { $addToSet: { following: userIdToFollow } })])
    sendResponse(res, 200, "Followed successfully")

  }
})