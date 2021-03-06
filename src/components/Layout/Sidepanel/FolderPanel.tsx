import { faFolder, faHome } from '@fortawesome/free-solid-svg-icons';
import React, { useContext } from 'react';

import ItemRow from '../Repository/ItemRow';

import { FoldersContext, RepoContext } from '../Repository/RepoLayout';

const FolderPanel: React.FC = () => {
  const { folders } = useContext(FoldersContext);
  const { owner, name, branch, curPath } = useContext(RepoContext);

  const rowStyles = {
    default: 'py-2 text-sm border border-transparent',
    active:
      'py-2 text-sm border rounded-[10px] border-stone-500 dark:border-[#aaa] px-3 w-fit ml-[-12px]',
  };

  return (
    <div className="border border-stone-500 dark:border-[#aaa] min-h-[50px] rounded-[10px] py-2 px-6 gap-2 grid pb-4">
      <ItemRow
        key={'/'}
        className={`${
          curPath === '/' ? rowStyles.active : rowStyles.default
        } mt-2`}
        href={`/gh/${owner}/${name}/${branch}/`}
        icon={faHome}
        title="All files"
      />
      {folders.map(({ path, active }) => (
        <ItemRow
          key={path}
          className={active ? rowStyles.active : rowStyles.default}
          href={`/gh/${owner}/${name}/${branch}/${path}`}
          icon={faFolder}
          title={path}
        />
      ))}
    </div>
  );
};

export default FolderPanel;
