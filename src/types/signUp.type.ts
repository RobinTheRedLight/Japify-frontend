export type SignupFormInputs = {
  name: string;
  email: string;
  password: string;
  image: FileList;
  role?: "user" | "admin";
};
