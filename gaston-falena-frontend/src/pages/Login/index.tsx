import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../../api/axios";

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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: joiResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
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
        alert(message);
      } else {
        console.error("Error inesperado:", error);
      }
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2>Iniciar Sesión</h2>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            {...register("email")}
            type="email"
            id="email"
            placeholder="ejemplo@correo.com"
          />
          {errors.email && (
            <span className="error-msg">{errors.email.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            {...register("password")}
            type="password"
            id="password"
            placeholder="******"
          />
          {errors.password && (
            <span className="error-msg">{errors.password.message}</span>
          )}
        </div>

        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
