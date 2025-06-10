import Link from 'next/link'
import React from 'react'
import Footer from '../_components/footer'

function Referral() {
  return (
    <div className="max-w-[800px] w-full mx-auto px-8 py-12 bg-white shadow-lg rounded-lg">
      {/* Brand */}
      <Link href="/">
        <h1 className="font-black text-center text-md text-indigo-600 hover:text-indigo-800 transition-colors">
          USATII MEDIA
        </h1>
      </Link>

      <h2 className="text-gray-800 my-5 text-4xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
        Referral Program.
      </h2>

      <div className="grid gap-y-3">
        <p className="font-bold text-gray-700">When you refer a new client:</p>
        <p className="font-bold text-gray-700">• Earn a <span className="text-indigo-600">$250</span> credit toward our services when they start their first month.
        </p>
        <p className="font-bold text-gray-700">• The referred client receives <span className="text-purple-600">15% off</span> their first project.
        </p>
        <p className="font-bold text-gray-700">• Credits stack without limit and never expire.
        </p>
        <div className="text-xs text-neutral-600 pt-4">
          <p className="mb-5">
            Usatii Media Referral Program – Terms and Conditions<br />
            Definitions<br />
            1.1. “Referrer” means any individual or entity that submits a referral in accordance with these terms.<br />
            1.2. “Referred Client” means a new client introduced to Usatii Media by a Referrer, upon whose first contract these terms apply.<br />

            Eligibility<br />
            2.1. Referrer and Referred Client must be distinct legal entities or individuals.<br />
            2.2. Referred Client must not have engaged Usatii Media for any services in the preceding 24 months.<br />

            Referral Credit<br />
            3.1. Upon execution of a service agreement between Usatii Media and Referred Client, Referrer will receive a <br />non-transferable credit of USD 250, applied toward any subsequent Usatii Media service.<br />
            3.2. Credit is issued only after full payment by Referred Client of all amounts due under their initial contract.<br />

            Referred Client Discount<br />
            4.1. Referred Client is entitled to a one-time discount equal to fifteen percent (15 %) of the total value of<br /> their first project.<br />
            4.2. Discount is applied to amounts invoiced and payable under the initial service agreement.<br />

            Stacking and Expiration<br />
            5.1. Referral credits awarded under Section 3 may be accumulated without limitation.<br />
            5.2. Referral credits do not expire.<br />

            General Provisions<br />
            6.1. Credits and discounts have no cash value and are non-transferable.<br />
            6.2. Usatii Media reserves the right to amend or terminate this program at any time, with or without notice.<br />
            6.3. These terms are governed by the laws of the State of New York.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Referral
