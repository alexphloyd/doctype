import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <main className="flex w-full h-[85vh] justify-center items-center flex-col space-y-2">
      <span className="text-xl tracking-widest mb-2">
        Oops! It seems we've hit a bump in the road..
      </span>
      <Button
        onClick={() => {
          navigate(-1);
        }}
      >
        Go Back
      </Button>
    </main>
  );
};
