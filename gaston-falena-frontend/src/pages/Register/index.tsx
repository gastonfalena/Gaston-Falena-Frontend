import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { api } from "../../api/axios";

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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: joiResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await api.post("/users/register", data);

      alert("¡Cuenta creada! Por favor inicia sesión.");
      navigate("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Error al registrarse");
      } else {
        console.error(error);
        alert("Error inesperado");
      }
    }
  };

  return (
    <div>
      <h2>Crear Cuenta</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor="name">Usuario</label>
          <input
            id="name"
            type="text"
            placeholder="Tu nombre de usuario"
            {...register("name")}
          />
          {errors.name && (
            <span style={{ color: "red" }}>{errors.name.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="ejemplo@correo.com"
            {...register("email")}
          />
          {errors.email && (
            <span style={{ color: "red" }}>{errors.email.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="******"
            {...register("password")}
          />
          {errors.password && (
            <span style={{ color: "red" }}>{errors.password.message}</span>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
      </p>
    </div>
  );
}
