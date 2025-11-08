import express from "express";
import { db } from "./db.js";
import { verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();

export function authConfig() {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      next(null, payload);
    })
  );
}

export const verificarAutenticacion = passport.authenticate("jwt", {
  session: false,
});

router.post(
  "/login",
  body("mail").isEmail().isLength({ max: 50 }),
  body("password").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0, 
  }),
  verificarValidaciones,
  async (req, res) => {
    const { mail, password } = req.body;

    const [usuarios] = await db.execute(
      "SELECT * FROM usuarios WHERE mail=?",
      [mail]
    );

    if (usuarios.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Usuario inválido" });
    }

    const hashedPassword = usuarios[0].password_hash;

    const passwordComparada = await bcrypt.compare(password, hashedPassword);

    if (!passwordComparada) {
      return res
        .status(400)
        .json({ success: false, error: "Contraseña inválido" });
    }

    // Generar jwt
    const payload = { userId: usuarios[0].id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    // Devolver jwt y otros datos
    res.json({
      success: true,
      token,
      username: usuarios[0].username,
    });
  }
);

export default router;
