import React,{useEffect,useRef,useState} from "react";
import "./CampusCarousel.css";

export default function CampusCarousel({items=[],img,navigate}){
  const sale=items.filter(i=>i.status==="Available"&&i.listingType==="sale").slice(0,6);
  const slides=[
    {type:"announcement",title:"Campus Marketplace",text:"Find affordable products listed by students on your campus.",label:"ANNOUNCEMENT",action:"Browse Products",onClick:()=>navigate("/browse")},
    {type:"announcement",title:"Buy • Sell • Rent • Borrow",text:"One simple place for students to share useful things.",label:"BORROW BOX",action:"Explore Now",onClick:()=>navigate("/browse")},
    ...sale.map(item=>({type:"product",item,label:"FOR SALE",title:item.title,text:item.category||"Campus product",action:"View Product",onClick:()=>navigate("/item-details/"+item._id)}))
  ];
  const [index,setIndex]=useState(0);
  const timer=useRef(null);
  useEffect(()=>{timer.current=setInterval(()=>setIndex(v=>(v+1)%Math.max(slides.length,1)),5000);return()=>clearInterval(timer.current)},[slides.length]);
  if(!slides.length)return null;
  const current=slides[index];
  return <section className="campus-carousel-section">
    <div className="campus-carousel-heading"><div><span>CAMPUS SPOTLIGHT</span><h2>Announcements & student products</h2></div><div className="campus-carousel-controls"><button onClick={()=>setIndex(v=>(v-1+slides.length)%slides.length)} aria-label="Previous">‹</button><button onClick={()=>setIndex(v=>(v+1)%slides.length)} aria-label="Next">›</button></div></div>
    <div className={"campus-carousel-card "+(current.type==="product"?"product-slide":"announcement-slide")}>
      {current.type==="product"&&current.item.imageUrl?<img src={img(current.item.imageUrl)} alt={current.title}/>:<div className="campus-carousel-art"><span>BB</span></div>}
      <div className="campus-carousel-overlay">
        <small>{current.label}</small><h3>{current.title}</h3><p>{current.text}</p><button onClick={current.onClick}>{current.action} <span>→</span></button>
      </div>
    </div>
    <div className="campus-carousel-dots">{slides.map((_,i)=><button key={i} className={i===index?"active":""} onClick={()=>setIndex(i)} aria-label={"Slide "+(i+1)}/>)}</div>
  </section>;
}
