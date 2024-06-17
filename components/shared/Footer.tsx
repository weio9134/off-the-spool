"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { sidebarLinks } from '@/constants'
import { usePathname, useRouter } from 'next/navigation'

const Footer = () => {
  const router = useRouter()
  const pathName = usePathname()
  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {/* turn side bar into the footer */}
        {sidebarLinks.map((link) => {
          const isActive = (pathName === link.route) || 
            (pathName.includes(link.route) && link.route !== "/")

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`bottombar_link ${isActive && 'bg-primary-500'}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={25}
                height={25}
              />
              {/* grab the first word */}
              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default Footer