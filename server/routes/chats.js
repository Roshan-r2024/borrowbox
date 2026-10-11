const express=require("express");const mongoose=require("mongoose");const BorrowRequest=require("../models/BorrowRequest");const Chat=require("../models/Chat");const User=require("../models/User");const Item=require("../models/Item");const router=express.Router();const clean=v=>String(v||"").trim().toLowerCase();
const publicUser=async email=>{const u=await User.findOne({email:clean(email)}).select("nickname profilePicture").lean();return {name:u?.nickname||"Student",profilePicture:u?.profilePicture||""};};
router.post("/",async(req,res)=>{
 try {
  const email=clean(req.body.email),orderId=String(req.body.orderId||""),itemId=String(req.body.itemId||"");
  if(!email)return res.status(400).json({message:"Please sign in before starting a chat."});
  let item,buyerEmail,sellerEmail,buyerName,sellerName,order=null;
  if(orderId){
   if(!mongoose.Types.ObjectId.isValid(orderId))return res.status(400).json({message:"Invalid order."});
   order=await BorrowRequest.findById(orderId);
   if(!order)return res.status(404).json({message:"Order not found."});
   if(clean(order.borrowerEmail)!==email&&clean(order.ownerEmail)!==email)return res.status(403).json({message:"You are not part of this order."});
   item=await Item.findById(order.item).lean();
   buyerEmail=clean(order.borrowerEmail);buyerName=order.borrower;
   sellerEmail=clean(order.ownerEmail);sellerName=order.owner;
  }else{
   if(!mongoose.Types.ObjectId.isValid(itemId))return res.status(400).json({message:"This is a sample listing, not a saved product. Please open a product saved in the database to chat."});
   item=await Item.findById(itemId).lean();
   if(!item)return res.status(404).json({message:"Product not found. Refresh Browse and try again."});
   sellerEmail=clean(item.ownerEmail);
   if(!sellerEmail)return res.status(422).json({message:"This listing has no seller email, so chat cannot be started. Ask the seller to update the listing."});
   if(sellerEmail===email)return res.status(403).json({message:"You cannot chat with yourself. Choose another seller's product."});
   const buyer=await User.findOne({email}).select("nickname email").lean();
   if(!buyer)return res.status(403).json({message:"Please sign in with a registered Borrow Box account before chatting."});
   buyerEmail=email;buyerName=buyer.nickname||"User";sellerName=item.owner||"Seller";
  }
  if(!item)return res.status(404).json({message:"Product not found."});
  if(!buyerEmail||!sellerEmail)return res.status(422).json({message:"Buyer or seller account details are missing for this listing."});
  // Demo seed listings use placeholder seller emails and have no real seller account.
  // Do not create a one-sided conversation that nobody can receive.
  const sellerAccount=await User.findOne({email:sellerEmail}).select("email").lean();
  if(!sellerAccount)return res.status(409).json({message:"This sample listing has no registered seller account yet. Chat works on items listed by real Borrow Box users."});
  // Keep one conversation per buyer + seller + item. This also lets a chat started
  // from an order reuse the existing product conversation instead of hitting the
  // unique buyerEmail/sellerEmail/item index and returning a database error.
  const conversationFilter={buyerEmail,sellerEmail,item:item._id};
  let chat=await Chat.findOne(conversationFilter);
  if(!chat){
   try {
    chat=await Chat.create({order:order?._id||null,item:item._id,itemTitle:item.title,buyerEmail,buyerName,sellerEmail,sellerName,messages:[]});
   } catch(createError) {
    if(createError.code===11000)chat=await Chat.findOne(conversationFilter);
    if(!chat)throw createError;
   }
  }
  return res.json(chat);
 }catch(error){
  console.error("CHAT CREATE ERROR:",error);
  return res.status(500).json({message:"Could not start the chat because of a server/database error. Please check that MongoDB is connected and try again."});
 }
});
router.get("/user/:email",async(req,res)=>{try{const email=clean(req.params.email);const chats=await Chat.find({$or:[{buyerEmail:email},{sellerEmail:email}]}).sort({updatedAt:-1}).lean();const out=await Promise.all(chats.map(async c=>{const other=clean(c.buyerEmail)===email?c.sellerEmail:c.buyerEmail;const p=await publicUser(other);return {...c,otherName:p.name,otherProfilePicture:p.profilePicture};}));res.json(out)}catch(error){res.status(500).json({message:"Unable to load chats"})}});
router.get("/:id",async(req,res)=>{try{const email=clean(req.query.email),chat=await Chat.findById(req.params.id).lean();if(!chat)return res.status(404).json({message:"Chat not found"});if(clean(chat.buyerEmail)!==email&&clean(chat.sellerEmail)!==email)return res.status(403).json({message:"You are not part of this chat"});const buyer=await publicUser(chat.buyerEmail),seller=await publicUser(chat.sellerEmail);res.json({...chat,buyerProfilePicture:buyer.profilePicture,sellerProfilePicture:seller.profilePicture});}catch(error){res.status(500).json({message:"Unable to load chat"})}});
router.post("/:id/messages",async(req,res)=>{try{const email=clean(req.body.email),text=String(req.body.text||"").trim();if(!email||!text)return res.status(400).json({message:"Message is required"});const chat=await Chat.findById(req.params.id);if(!chat)return res.status(404).json({message:"Chat not found"});if(clean(chat.buyerEmail)!==email&&clean(chat.sellerEmail)!==email)return res.status(403).json({message:"You are not part of this chat"});const user=await User.findOne({email}).select("nickname").lean();chat.messages.push({senderEmail:email,senderName:user?.nickname||(email===clean(chat.buyerEmail)?chat.buyerName:chat.sellerName),text});await chat.save();res.json(chat)}catch(error){res.status(500).json({message:"Unable to send message"})}});module.exports=router;
