import { generateToken } from "../../middleware/generateToken.js";
import User from "../../models/userModel.js";
import { tryCatch } from "../../utils/tryCatch.js";
import bcryptjs from "bcryptjs";

export const signUp = tryCatch(async (req, res) => {
    const { fullname, email, password, mobile, roles } = req.body;

    // Check missing input
    if (!fullname || !email || !password) {
        return res.status(400).json({
            status: false,
            message: "Fullname, email and password are required"
        });
    }

    // Check email exists
    const emailExist = await User.findOne({ email });
    if (emailExist) {
        return res.status(400).json({
            status: false,
            message: "This account already belongs to this email address."
        });
    }

    // Validate password length
    if (password.length < 8) {
        return res.status(400).json({
            status: false,
            message: "Password length must be minimum 8 characters"
        });
    }

    // Hashing password
    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await User.create({
        fullname,
        email,
        password: hashedPassword,
        mobile,
        roles
    });

    // Generate token
    const token = await generateToken(user._id);
    res.cookie("token", token, {
        secure: false,
        sameSite: "strict",
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true
    });
    return res.status(201).json({
        status: true,
        message: "Your account was created successfully",
        token,
        data: user
    });
});

export const signIn = tryCatch(async (req, res) => {
    const { email, password } = req.body;
    // Validate inputs
    if (!email) {
        return res.status(400).json({
            status: false,
            message: "Please enter email address"
        });
    }
    if (!password) {
        return res.status(400).json({
            status: false,
            message: "Please enter password"
        });
    }
    // Check user exists
    const userInfo = await User.findOne({ email });
    if (!userInfo) {
        return res.status(400).json({
            status: false,
            message: "No account found with this email"
        });
    }
    // Check password
    const passMatched = await bcryptjs.compare(password, userInfo.password);
    if (!passMatched) {
        return res.status(400).json({
            status: false,
            message: "Incorrect password"
        });
    }

    // Generate token
    const token = generateToken(userInfo._id);
    res.cookie("token", token, {
        secure: false,
        sameSite: "strict",
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true
    });
    return res.status(200).json({
        status: true,
        message: "User logged in successfully",
        token
    });
});

export const signOut = tryCatch(async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    });

    return res.status(200).json({
        status: true,
        message: "User logged out successfully"
    });
});
