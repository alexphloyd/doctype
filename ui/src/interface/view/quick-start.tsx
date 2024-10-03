import { Button, Kbd } from '@mantine/core';
import { RocketIcon } from '@radix-ui/react-icons';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { documentManagerModel } from '../application/document/manager/model';

export const QuickStart = observer(() => {
  const navigate = useNavigate();

  const handleGenerate = () => documentManagerModel.generateSample.run();
  const openAboutPage = () => {
    navigate('/about');
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col -mt-[10vh] gap-2">
      <h1
        className="flex items-center text-[27px] tracking-wide text-cyan-800/90 gap-x-1 cursor-pointer"
        onClick={openAboutPage}
      >
        Seamless note-taking tool
        <img src="/logo.webp" width={30} height={30} className="-mt-[2px]" alt="app-logo" />
      </h1>

      <p className="flex space-x-2 items-center">
        <Button onClick={handleGenerate} size="sm" variant="gradient" className="h-[35px]">
          Generate sample <RocketIcon className="ml-2" />
        </Button>
        <span className="font-['JetBrainsMono'] tracking-wide text-gray-500">
          or create yours with
        </span>
        <div className="px-2 py-2 space-x-2 flex items-center justify-center ">
          <Kbd className="h-8 w-8">
            <p className="-mt-[4px] text-[20px]">⌥</p>
          </Kbd>
          <span className="text-gray-400">+</span>
          <Kbd className="h-8 w-8 text-center font-['JetBrainsMono']">
            <p className="text-[15px]">N</p>
          </Kbd>
        </div>
      </p>
    </div>
  );
});
