interface AuthButtonProps {
  text: string;
  loading?: boolean;
}

export default function AuthButton({ text, loading }: AuthButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-[#5272FF]
      text-white leading-0 h-10 py-4 rounded-lg flex items-center justify-center
      font-medium "
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
              5.291A7.962 7.962 0 014 12H0c0 3.042 
              1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </>
      ) : (
        text
      )}
    </button>
  );
}
