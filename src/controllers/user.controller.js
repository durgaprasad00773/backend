import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"

const registeruser = asyncHandler( async (req, res) => {
        //get details from the frontend

        const {username, email, fullName, password} = req.body

        //validation i.e all fields are filled

        // if(username === "")
        // {
        //     throw new ApiError(404, "All fields are required")
        // }
        // ++++++++++++++++++++we can check all fileds individually+++++++++++++++++++++++


        if(
            [fullName, email, username, password].some((field) => !field||field?.trim() === "")
        )
        {
            throw new ApiError(404, "All fields are required")
        }


        //check if user already existed

        const existedUser = await User.findOne({
            $or : [{email}, {username}]
        })

        if(existedUser) {
            throw new ApiError(409, "username or email already existed")
        }

        //images and avatar

        const avatarFilePath = req.files?.avatar[0]?.path
        const coverFilePath = req.files?.coverImage[0]?.path

        //check for avatar

        if(!avatarFilePath)
        {
            throw new ApiError(400, "avatar file is required")
        }

        //upload them in cloudnary

        const avatar = await uploadOnCloudinary(avatarFilePath)
        const cover = await uploadOnCloudinary(coverFilePath)

        if(!avatar)
        {
            throw new ApiError(400, "Avatar file is required")
        }


        //create userobject

        const user = await User.create({
            fullName, 
            avatar : avatar.url,
            coverImage : cover?.url || "",
            username,
            password,
            email
        })

        //remove password and refresh token from response

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        //check for user creation

        if(!createdUser)
        {
            throw new ApiError(500, "Something went wrong while registration")
        }
        //return response

        return res.status(201).json(
            new ApiResponse(201, "Registered Successfully", createdUser)
        )



})

export {registeruser}