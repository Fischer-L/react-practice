import { AnchorHTMLAttributes, DetailedHTMLProps, FC, PropsWithChildren, Ref } from 'react';
import Link from 'next/link';

export type ToProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

const To: FC<PropsWithChildren<ToProps>> = ({
  href,
  children, ...props
}) => {
  const addr = href || '/';
  return (
    <Link
      className="text-blue-400 hover:text-blue-600 underline"
       href={addr}
       {...props}
    >
      {children}
    </Link>
  );
}

export default To;
