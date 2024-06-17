import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SignOutButton, SignedIn, OrganizationSwitcher } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

const NavBar = () => {
  return (
    <nav className="topbar">
      {/* logo */}
      <Link href="/" className="flex items-center gap-4">
        <Image
          className='invert'
          src="/needle_thread.png"
          alt="logo"
          width={50}
          height={50}
        />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">
          Off the Spool
        </p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          {/* only display when signed in */}
          <SignedIn>
            {/* allow user to sign out */}
            <SignOutButton redirectUrl="/sign-in">
              <div className="flex cursor-pointer">
                <Image
                  src='/assets/logout.svg'
                  alt='logout'
                  width={25}
                  height={25}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>

        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4"
            }
          }}
        />
      </div>
    </nav>
  )
}

export default NavBar