import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import { prisma } from "../../lib/prisma";
import { LoginInput, RegisterInput } from "../../schemas/auth.schema";
import { UserRole } from "../../generated/prisma/enums";

const JWT_SECRET: Secret = process.env.JWT_SECRET ?? "dev-secret";
const expiresInEnv = process.env.JWT_EXPIRES_IN;
const defaultExpiresIn: StringValue = "1d";
const parsedExpiresIn = expiresInEnv ? Number(expiresInEnv) : undefined;
const expiresInOption: number | StringValue =
  parsedExpiresIn && !Number.isNaN(parsedExpiresIn)
    ? parsedExpiresIn
    : (expiresInEnv as StringValue | undefined) ?? defaultExpiresIn;
const JWT_SIGN_OPTIONS: SignOptions = { expiresIn: expiresInOption };

const hashPassword = (password: string) => bcrypt.hash(password, 10);
const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);

const signToken = (payload: { id: string; role: string; email: string }) =>
  jwt.sign(payload, JWT_SECRET, JWT_SIGN_OPTIONS);

export const authService = {
  register: async (input: RegisterInput) => {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw Object.assign(new Error("Email already registered"), { status: 409 });
    }

    const passwordHash = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        fullName: input.fullName,
        phone: input.phone ?? null,
        role: (input.role as UserRole) ?? UserRole.DONOR,
      },
    });

    return {
      user,
      token: signToken({ id: user.id, role: user.role, email: user.email }),
    };
  },

  login: async (input: LoginInput) => {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user,
      token: signToken({ id: user.id, role: user.role, email: user.email }),
    };
  },
};
