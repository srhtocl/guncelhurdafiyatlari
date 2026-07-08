
import { useRouteError } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();

  const errorStyle = "flex flex-col w-full h-full flex flex-col items-center justify-center h-screen w-screen bg-gray-100 font-sans text-xl text-red-600";

  return (
    <div id="error-page" className={errorStyle}>
      <p className="mx-4 text-center">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
