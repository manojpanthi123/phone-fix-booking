import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders phone fix booking header", () => {
  render(<App />);
  expect(screen.getByText(/Phone Fix Booking System/i)).toBeInTheDocument();
});
