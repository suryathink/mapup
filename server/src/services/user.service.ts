import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";
import { generateToken } from "../utils/jwtHelper";
export class UserService {
  public static async create(name: string, email: string, password: string) {
    const alreadyExisting = await User.findOne({
      email,
    });

    if (alreadyExisting) {
      return {
        isError: true,
        message: "User already exists with this email",
      };
    }
    let user = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password),
    });
    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  public static async login(email: string, password: string) {
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return {
        isError: true,
        message: "Invalid email or password",
      };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return {
        isError: true,
        message: "Invalid email or password",
      };
    }

    // Generate the token without the password
    const { password: _, ...userWithoutPassword } = user;

    return {
      token: generateToken(userWithoutPassword as Partial<IUser>),
      user: userWithoutPassword,
    };
  }
}
