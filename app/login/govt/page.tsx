import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <Link href={'/dashboard/gp'}>
            <button>
                refirect
            </button>
        </Link>
    )
}

export default page
