import User from './../models/user.models.js';

export const findUserByEmail = async (email) => {
  return await User.findOne({ email })
};

export const createUser = async (userData) => {
  const newUser = new User(userData);
  return await newUser.save();
};
