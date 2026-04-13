import { create } from "zustand";

export const useSignupStore = create(() => ({
  name: "",
  phoneNumber: "",
  email: "",
}));

export const setSignup = (details) => {
  useSignupStore.setState({
    name: details.name,
    phoneNumber: details.phoneNumber,
    email: details.email,
  });
};
export const removeSignup = () => {
  useSignupStore.setState({
    name: "",
    phoneNumber: "",
    email: "",
  });
};
