export const Input = ({ title, type, register }) => {
  return (
    <input
      type={type}
      placeholder={title}
      {...register}
      className="mt-5 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
  );
};
