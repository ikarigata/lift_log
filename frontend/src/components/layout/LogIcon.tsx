import React from "react";

const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6.5 6.5C6.5 7.33 5.83 8 5 8C4.17 8 3.5 7.33 3.5 6.5C3.5 5.67 4.17 5 5 5C5.83 5 6.5 5.67 6.5 6.5Z"
      fill="currentColor"
    />
    <path
      d="M20.5 6.5C20.5 7.33 19.83 8 19 8C18.17 8 17.5 7.33 17.5 6.5C17.5 5.67 18.17 5 19 5C19.83 5 20.5 5.67 20.5 6.5Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.5 6.5C14.5 7.33 13.83 8 13 8H11C10.17 8 9.5 7.33 9.5 6.5C9.5 5.67 10.17 5 11 5H13C13.83 5 14.5 5.67 14.5 6.5ZM8 11V18H16V11H8ZM7 9C6.45 9 6 9.45 6 10V19C6 19.55 6.45 20 7 20H17C17.55 20 18 19.55 18 19V10C18 9.45 17.55 9 17 9H7Z"
      fill="currentColor"
    />
  </svg>
);

export default LogoIcon;