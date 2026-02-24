import { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { api } from "../../api/axios";
import "./Register.css";

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
}

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.empty": "El usuario es obligatorio",
    "string.min": "El usuario debe tener al menos 3 caracteres",
    "string.max": "El usuario no puede tener más de 30 caracteres",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "El email es obligatorio",
      "string.email": "El formato del email no es válido",
    }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "La contraseña es obligatoria",
    "string.min": "La contraseña debe tener al menos 6 caracteres",
  }),
});

export default function Register() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: joiResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setServerError(null);
    try {
      await api.post("/users/register", data);
      navigate("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setServerError(error.response?.data?.message || "Error al registrarse");
      } else {
        setServerError("Error inesperado al conectar con el servidor.");
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Crear Cuenta</h2>

        {serverError && <div className="error-message">{serverError}</div>}

        <form
          className="auth-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="input-group">
            <label htmlFor="name">Usuario</label>
            <input
              id="name"
              type="text"
              placeholder="Tu nombre de usuario"
              className={errors.name ? "input-error" : ""}
              {...register("name")}
            />
            {errors.name && (
              <span className="error-text">{errors.name.message}</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              className={errors.email ? "input-error" : ""}
              {...register("email")}
            />
            {errors.email && (
              <span className="error-text">{errors.email.message}</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="******"
              className={errors.password ? "input-error" : ""}
              {...register("password")}
            />
            {errors.password && (
              <span className="error-text">{errors.password.message}</span>
            )}
          </div>

          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <div className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
        </div>
      </div>
    </div>
  );
}
