import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { FilesList, RepoLayout } from '@/components';
import { IFolderTree, IRepoInfo, IRepoParams } from '@/types';
import {
  loadMarkdownFileIsomorphic,
  loadRepoInfo,
  loadRepoStructure,
} from '@/utils';
import { getSession } from 'next-auth/react';
import Head from 'next/head';

const RepoPage: React.FC<{
  tree: IFolderTree[];
  params: IRepoParams;
  file: string;
  info: IRepoInfo;
}> = ({ tree, params, file, info }) => {
  const isMarkdownFile = (path: string[] = []) =>
    path.join('/').includes('.md');

  return (
    <>
      <Head>
        <title>{`${params.repo_name}/${params.repo_path}`}</title>
        <meta
          name="description"
          content={`${params.repo_name}/${params.repo_path}`}
        />
      </Head>
      <RepoLayout tree={tree} params={params} file={file} info={info}>
        {isMarkdownFile(params.repo_path) ? (
          <MarkdownBlock file={file} />
        ) : (
          <FilesList tree={tree} />
        )}
      </RepoLayout>
    </>
  );
};

export default RepoPage;

const MarkdownBlock: React.FC<{ file: string }> = ({ file }) => {
  return (
    <div
      className=" transition-colors prose dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: file }}
    />
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const params: IRepoParams = context.params || {};
  // experimental caching
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );
  const session = await getSession(context);
  const tree = await loadRepoStructure(params, session);
  const info = await loadRepoInfo(params, session);
  // redirect repos with 1 file only to that file
  if (tree.length === 1 && tree[0].path !== params.repo_path?.join('/')) {
    return {
      redirect: {
        permanent: false,
        destination: `/gh/${params.repo_user}/${params.repo_name}/${params.repo_branch}/${tree[0].path}`,
      },
    };
  }
  if (params?.repo_path?.join('/').includes('.md')) {
    const file = await loadMarkdownFileIsomorphic(params, session);
    return { props: { tree, params, file, info } };
  }
  return { props: { tree, params, info } };
}
