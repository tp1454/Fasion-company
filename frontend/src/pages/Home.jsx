import React from 'react'
export default function Home(){
  return (
    <div>
      <section className='mb-6'>
        <div className='h-56 bg-gradient-to-r from-pink-300 to-yellow-200 rounded-lg flex items-center justify-center'>
          <h1 className='text-3xl font-bold'>Welcome to Fashion Co.</h1>
        </div>
      </section>
      <section>
        <h2 className='text-xl font-semibold mb-3'>Featured Products</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='border rounded p-3'>Sample Product</div>
          <div className='border rounded p-3'>Sample Product</div>
        </div>
      </section>
    </div>
  )
}
