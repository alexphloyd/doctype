import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '~/core/shared/ui/buttons/primary';

export const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <main className="flex w-full h-[85vh] justify-center items-center flex-col space-y-2">
      <span className="text-xl tracking-widest mb-2">
        Oops! It seems we've hit a bump in the road..
      </span>
      <PrimaryButton
        className="px-10"
        type="transparent"
        content="Back"
        onClick={() => {
          navigate(-1);
        }}
      />
    </main>
  );
};
