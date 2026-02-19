import { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../../api/axios";
import "./login.css"; // ¡No olvides importar el CSS!

interface LoginFormInputs {
  email: string;
  password: string;
}

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "El email es obligatorio",
      "string.email": "Formato de email inválido",
    }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "La contraseña es obligatoria",
    "string.min": "La contraseña debe tener al menos 6 caracteres",
  }),
});

export default function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: joiResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setServerError(null); // Limpiamos errores previos
    try {
      const response = await api.post("/auth/login", data);

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("isAuthenticated", "true");

        navigate("/dashboard");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Credenciales incorrectas";
        setServerError(message); // En lugar de alert, usamos el estado
      } else {
        setServerError("Error inesperado al conectar con el servidor.");
        console.error("Error inesperado:", error);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Iniciar Sesión 👋</h2>
        <p className="auth-subtitle">Ingresa a tu cuenta para continuar</p>

        {/* Mostramos errores que vienen del backend (Ej: Contraseña mal) */}
        {serverError && <div className="error-message">{serverError}</div>}

        <form
          className="auth-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="ejemplo@correo.com"
              /* Si hay error de Joi, le ponemos un borde rojo */
              className={errors.email ? "input-error" : ""}
            />
            {/* Mensaje de error de Joi (Ej: Formato inválido) */}
            {errors.email && (
              <span className="error-text">{errors.email.message}</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              {...register("password")}
              type="password"
              id="password"
              placeholder="******"
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && (
              <span className="error-text">{errors.password.message}</span>
            )}
          </div>

          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="auth-footer">
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
}
