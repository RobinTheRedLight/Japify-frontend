import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../../redux/features/auth/authApi";
import { SignupFormInputs } from "../../types/signUp.type";
import registerImg from "../../assets/auth/register.jpg";

const SignUp = () => {
  const imageHostKey = import.meta.env.VITE_imgbb_key;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>();

  const [signup] = useSignUpMutation();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    let imageUrl = "";
    try {
      Swal.fire({
        title: "Uploading image...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const image = data.image[0];
      const formData = new FormData();
      formData.append("image", image);
      const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const imgData = await response.json();

      Swal.close();

      if (imgData.success) {
        imageUrl = imgData.data.url;
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Image upload failed",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }

      const signUpInfo = {
        name: data.name,
        email: data.email,
        password: data.password,
        image: imageUrl,
        role: "user",
      };

      const result = await signup(signUpInfo).unwrap();
      if (result) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Sign up successful",
          text: "You have successfully signed up.",
          showConfirmButton: false,
          timer: 3000,
          toast: true,
          timerProgressBar: true,
        });

        navigate("/login");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Swal.close();

      const errorMessage =
        error?.data?.errorSources?.[0]?.message || "An error occurred";
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: errorMessage,
        text: "Please try again.",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  bg-white">
      <div className="flex flex-col md:flex-row  rounded-lg overflow-hidden w-full ">
        {/* Image Section */}
        <div className="md:w-1/2 hidden md:block">
          <img
            src={registerImg}
            alt="Register"
            className="w-full h-screen object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8 ">
          <div className="max-w-md w-full">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
              Create Your Account
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Name Field */}
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  className={`w-full mt-2 px-4 py-2 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`w-full mt-2 px-4 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full mt-2 px-4 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Image Field */}
              <div className="mb-6">
                <label className="block text-gray-700" htmlFor="image">
                  Profile Photo
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  {...register("image", { required: "Photo is required" })}
                  className={`w-full mt-2 px-4 py-2 border ${
                    errors.image ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.image.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white text-lg py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              >
                Sign Up
              </button>

              <p className="text-sm text-center mt-4 text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-600 hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
