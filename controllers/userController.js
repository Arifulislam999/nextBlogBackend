const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const crypto = require("crypto");

const validateEmail = require("../utils/checkEmail");

const reactCookie = require("react-cookies");

// Generate Web Token.
const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

class userController {
  // userRegistation
  static userRegistation = asyncHandler(async (req, res) => {
    const { email, name, password } = req.body.data;
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      if (email && name && password) {
        if (!validateEmail(email)) {
          res.status(400);
          throw new Error("Your Email is not valid.");
        } else if (password.length < 4) {
          res.status(400);
          throw new Error("Password must be more than 3 characthers.");
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);

          // create new user

          const user = await userModel.create({
            name,
            email,
            password: hashPassword,
          });

          if (user) {
            const { _id, name, email, bio, phone, photo } = user;

            // generate token
            const token = generateToken(_id);

            // Send HTTP-only cookie
            // res.cookie("token", token, {
            //   // path: "/",
            //   httpOnly: true,
            //   maxAge: 86400000, // 1 day
            //   sameSite: "none",
            //   secure: false,
            // });
            reactCookie.save("token", token, {
              path: "/api/user/loggedin",
              expires: 86400000,
              maxAge: 86400000,
              // domain: "https://play.bukinoshita.io",
              secure: true,
              httpOnly: true,
            });
            // console.log(reactCookie.load("token"));

            res.status(201).json({
              _id,
              name,
              email,
              bio,
              phone,
              photo,
              token,
            });
          } else {
            res.status(400);
            throw new Error("Invalid user data.");
          }
        }
      } else {
        res.status(400);
        throw new Error("Please fill in all required fields.");
      }
    } else {
      res.status(400);
      throw new Error("This email already signed In.");
    }
  });

  // user update password
  static userUpdatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, email } = req.body;
    const existingUser = await userModel.findOne({ email: email });
    const matchPassword = await bcrypt.compare(
      oldPassword,
      existingUser.password
    );
    if (existingUser) {
      if (matchPassword) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);
        const updatePassword = await userModel.findByIdAndUpdate(
          { _id: existingUser?._id },
          { password: hashPassword },
          {
            new: true,
          }
        );
        res.status(200).json({ updatePassword });
      } else {
        res.status(400);
        throw new Error("Old password does't match.");
      }
    } else {
      res.status(400);
      throw new Error("This email is'n user.");
    }
  });

  // user Log in
  static userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body.data;

    if (email && password) {
      const findUser = await userModel.findOne({ email: email });
      if (findUser) {
        const matchPassword = await bcrypt.compare(password, findUser.password);

        if (matchPassword) {
          const { _id, email, name, phone, photo, bio } = findUser;
          // generate token
          const token = generateToken(_id);

          // Set HTTP-only cookie
          // res.cookie("token", token, {
          //   path: "/",
          //   httpOnly: true,
          //   expires: new Date(Date.now() + 1000 * 86400), // 1 day
          //   sameSite: "none",
          //   // secure: false,
          // });
          reactCookie.save("token", token, {
            path: "/api/user/loggedin",
            expires: 86400000,
            maxAge: 86400000,
            // domain: "https://play.bukinoshita.io",
            secure: true,
            httpOnly: true,
          });
          res.status(200).json({
            _id,
            email,
            name,
            phone,
            photo,
            bio,
            token,
          });
        } else {
          res.status(400);
          throw new Error("Don't match the password or email.");
        }
      } else {
        res.status(400);
        throw new Error("This user not signed in.");
      }
    } else {
      res.status(400);
      throw new Error("All fields are required.");
    }
  });

  // log out route

  static userLogout = asyncHandler(async (req, res) => {
    // Send HTTP-only cookie clear cookie
    res.cookie("token", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(0),
      sameSite: "none",
      secure: true,
    });

    reactCookie.remove("token", { path: "/api/user/loggedin" });

    return res
      .status(200)
      .json({ message: "successfully Logged Out.", status: "LogOut" });
  });

  // Get User

  static getUser = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user._id);
    if (user) {
      const { _id, email, name, phone, photo, bio } = user;
      res.status(200).json({ _id, email, name, phone, photo, bio });
    } else {
      res.status(400);
      throw new Error("User Not Found.");
    }
  });

  // User loggedIn status
  static loggedinStatus = asyncHandler(async (req, res) => {
    // const token = req.cookies.token;
    const Token = reactCookie.load("token");
    // console.log("React Token", Token);
    if (!Token) {
      return res.json({ status: false, phone: null });
    }
    const verified = jwt.verify(Token, process.env.JWT_SECRET_KEY);
    if (verified) {
      const photo = await userModel.findById({ _id: verified?.userId });
      return res.json({ status: true, photo: photo.photo });
    }
    return res.json({ status: false, photo: null });
  });

  // update user

  static updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    const user = await userModel.findById(_id);

    if (user) {
      const { name, phone, _id, photo, bio } = user;

      await userModel.findByIdAndUpdate(
        _id,
        {
          name: req.body.data.name || name,
          phone: req.body.data.phone || phone,
          photo: req.body.data.photo || photo,
          bio: req.body.data.bio || bio,
        },
        { new: true }
      );
      return res.status(200).json({ message: "successfully update user." });
    } else {
      return res.status(401).json({ message: "Can't update user." });
    }
  });

  //forgate password.

  // static forgotePassword = asyncHandler(async (req, res) => {
  //   const { email } = req.body;
  //   const user = await userModel.findOne({ email });
  //   if (!user) {
  //     res.status(401);
  //     throw new Error("User does not exists.");
  //   } else {
  //     // generate query token

  //     let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  //     // Hash token before save
  //     const hashedToken = crypto
  //       .createHash("sha256")
  //       .update(resetToken)
  //       .digest("hex");

  //     await new tokenModel({
  //       userId: user._id,
  //       token: hashedToken,
  //       createdAt: Date.now(),
  //       expiresAt: Date.now() + 30 * (60 * 1000), // 30 min
  //     }).save();

  //     // construct reset email
  //     const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  //     // Reset Email
  //     const message = `
  //     <h2>Hello ${user.name}</h2>
  //     <p>Please use the url below to reset your password.</p>
  //     <p>This Reset link is valid for only 30 minutes.</p>

  //     <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
  //     <p>Regards...</p>
  //     `;
  //     const subject = "Password Reset Request";
  //     const send_to = user.email;

  //     const send_form = process.env.EMAIL_USER;
  //     try {
  //       await sendEmail(subject, message, send_to, send_form);
  //       res.status(200).json({ success: true, message: "Reset Email Sent." });
  //     } catch (error) {
  //       res.status(401);
  //       throw new Error("Email not sent,please try again.");
  //     }
  //   }
  // });
}
module.exports = userController;
