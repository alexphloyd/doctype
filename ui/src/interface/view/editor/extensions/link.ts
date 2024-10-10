import Link from '@tiptap/extension-link';

export const ExtendedLink = Link.configure({
  autolink: true,
  openOnClick: true,
  linkOnPaste: true,
});
