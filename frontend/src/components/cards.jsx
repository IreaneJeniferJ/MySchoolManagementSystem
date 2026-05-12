const cards = (props) => {
  return (
   
    <section className='flex w-80 h-45 shadow-lg inset-shadow-sm rounded-sm p-6'>
    <div className="flex justify-center items-center w-full h-auto">
      <img src={props.img} className="w-[100px] md:w-[100px] sm:w-[150px] h-auto object-cover" />
    </div>
    <article className='flex flex-col justify-center items-center w-full'>
      <h6>{props.title}</h6>
      <h3>{props.count}</h3>
    </article>
  </section>
    
  )
}

export default cards