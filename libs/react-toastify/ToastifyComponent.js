"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Brand look (cream / chocolate brown / ruby palette) lives next to this file
// and overrides the library defaults through its --toastify-* variables.
import "./toastify.css";

const ToastifyComponent = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      // Palette is cream based, so the light card fits every page.
      theme="light"
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      draggablePercent={60}
      hideProgressBar={false}
      // Never stack more than a few, keeps the corner tidy on mobile.
      limit={3}
    />
  );
};

export default ToastifyComponent;
