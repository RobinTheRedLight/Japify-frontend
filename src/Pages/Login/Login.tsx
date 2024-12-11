import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { setUser } from "../../redux/features/auth/authSlice";
import { LoginFormInputs } from "../../types/login.type";
import { AppDispatch } from "../../redux/store";
import loginImg from "../../assets/auth/login.jpg";
import { Helmet } from "react-helmet-async";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const [login] = useLoginMutation();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const loginInfo = {
      email: data.email,
      password: data.password,
    };

    try {
      const result = await login(loginInfo).unwrap();
      if (result) {
        dispatch(setUser({ user: result.data, token: result.token }));
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Login Successful",
          text: "You have successfully logged in.",
          showConfirmButton: false,
          timer: 3000,
          toast: true,
          timerProgressBar: true,
        });

        navigate(from, { replace: true });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error?.data?.errorSources?.[0]?.message || "An error occurred";
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: errorMessage,
        text: "Please check your credentials and try again.",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      <Helmet>
        <title>Japify | Login</title>
      </Helmet>
      {/* Image Section */}
      <div
        className="hidden lg:flex w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginImg})` }}
      ></div>

      {/* Form Section */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800">Login</h2>
            <p className="mt-2 text-gray-600">
              Welcome back! Please enter your details.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email Field */}
            <div className="mb-6">
              <label
                className="block font-medium text-gray-700"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full mt-2 px-4 py-3 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label
                className="block font-medium text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                })}
                className={`w-full mt-2 px-4 py-3 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full text-lg py-3 rounded-lg hover:bg-blue-600 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-sm text-center mt-6 text-gray-600">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
