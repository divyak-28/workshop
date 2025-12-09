const User = require("../models/user");


// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;


    // Create new user
    const user = new User({
      name,
      email,
      password,
    });


    // Save user to database
    const savedUser = await user.save();


    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: savedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};


// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();


    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving users",
      error: error.message,
    });
  }
};


// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;


    const user = await User.findById(id);


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving user",
      error: error.message,
    });
  }
};


// Update user by ID
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    //check  all 3 fields are provided
    if(!name||!email||!password){
      return res.status(400).json({
        success:false,
        message:"all fields are required to update user",

      });
    }


    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, password },
      {new:true, runValidators:true}
    );


    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};





// Delete user by ID
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;


    const deletedUser = await User.findByIdAndDelete(id);


    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};


/*
// PATCH: Partially update user by ID
const patchUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    // Build an updates object only with fields that are provided
    const updates = {};

    if (name !== undefined) {
      if (!name || name.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty if provided",
        });
      }
      updates.name = name;
    }

    if (email !== undefined) {
      if (!email || email.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Email cannot be empty if provided",
        });
      }
      updates.email = email;
    }

    if (password !== undefined) {
      if (!password || password.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Password cannot be empty if provided",
        });
      }
      updates.password = password;
    }

    // If no fields were sent, block the request
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Send at least one field (name, email, or password) to update",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User patched successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error patching user",
      error: error.message,
    });
  }
};
*/
const patchUser  = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User updated successfully", data: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error updating user", error: error.message });
  }
};


module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  patchUser
};


