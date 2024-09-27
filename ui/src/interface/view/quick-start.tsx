import { Button, Kbd } from '@mantine/core';
import { RocketIcon } from '@radix-ui/react-icons';
import { observer } from 'mobx-react-lite';

import { documentManagerModel } from '../application/document/manager/model';

export const QuickStart = observer(() => {
  const handleGenerate = () => documentManagerModel.generateSample.run();

  return (
    <div className="min-h-screen flex items-center justify-center flex-col -mt-[10vh] gap-2">
      <p className="flex items-center text-[29px] font-['JetBrainsMono'] tracking-wide text-cyan-800/90 gap-x-1">
        Seamless note-taking tool
        <img src="/logo.webp" width={100} height={100} className="w-8 h-8" />
      </p>

      <p className="flex space-x-2 items-center">
        <Button onClick={handleGenerate} size="sm" variant="outline" className="h-[35px]">
          Generate sample <RocketIcon className="ml-2" />
        </Button>
        <span className="font-['JetBrainsMono'] tracking-wide text-gray-400/90">
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
