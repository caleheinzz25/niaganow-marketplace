import { JSX } from "solid-js/jsx-runtime";

interface Props {
    text: string
}

export const Back = ({ text }: Props) => {
  return (
    <button
      onclick={() => history.back()}
      class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
    >
      <i class="fas fa-arrow-left"></i>
      <span>{text}</span>
    </button>
  );
};
