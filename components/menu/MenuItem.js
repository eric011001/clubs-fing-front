import React from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router';
const MenuItem = ({ icono, titulo, link }) => {
  const router = useRouter();
  return (
    <li className={router.pathname === `/controlPanel/${link}` ? ('menu-item active') : ('menu-item')} >
      <Link href={`/controlPanel/${link}`}>
        <a>
          <span className="icon">
            <ion-icon name={icono}></ion-icon>
          </span>
          <span className="title font-semibold text-lg">{titulo}</span>
        </a>
      </Link>
    </li>
  );
};

export default MenuItem;
