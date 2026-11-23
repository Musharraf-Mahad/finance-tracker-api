import User from '../models/User.js'
import { generateToken } from '../utils/generateToken.js';

export const register = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id);
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};


export const login = async(req, res, next) => {
    let { name, email, password } = req.body;
    try {
        email = email.toLowerCase();
        const user = await User.findOne({ email });
        if(!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password"})
        }

        const token = generateToken(user._id)
        res.json({ token })
    } catch (error) {
            next(error)
    }
}
