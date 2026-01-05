import { asyncHandler } from "../utils/asyncHandler";
import { sendResponse } from "../utils/sendResponse";

export const uploadImage = asyncHandler(
  async (req, res) => {
    const imageUrl = req.file?.path;

    return sendResponse(res, 200, "Image upload upload successfully", {
      imageUrl: imageUrl,
    });
  }
);
