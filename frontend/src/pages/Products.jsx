import React, {useEffect, useState} from 'react'
import api from '../services/api'

export default function Products(){
  const [items, setItems] = useState([])
  useEffect(()=>{
    api.get('/products.php').then(r=> setItems(r.data)).catch(()=>{})
  },[])
  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Products</h1>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
        {items.length===0 && <div>No products (try backend)</div>}
        {items.map(p=> (
          <div key={p.id} className='border rounded p-3'>
            <img src={p.image || '/placeholder.png'} alt={p.name} className='w-full h-40 object-cover mb-2' />
            <h3 className='font-semibold'>{p.name}</h3>
            <div className='text-sm'>{p.price} VND</div>
          </div>
        ))}
      </div>
    </div>
  )
}
