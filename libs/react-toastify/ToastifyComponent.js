"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastifyComponent = () => {
  return <ToastContainer position="top-right" autoClose={5000} theme="dark" />;
};

export default ToastifyComponent;
