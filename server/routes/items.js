const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const Item = require("../models/Item");
const User = require("../models/User");
const router = express.Router();
const uploadDir = path.join(__dirname, "../uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({ destination: (_req, _file, cb) => cb(null, uploadDir), filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`) });
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (_req, file, cb) => { const allowed = ["image/jpeg","image/jpg","image/png","image/webp"]; cb(allowed.includes(file.mimetype) ? null : new Error("Only JPG, JPEG, PNG and WEBP images are allowed."), allowed.includes(file.mimetype)); } });
const prohibitedPattern = /\b(drug|drugs|cocaine|heroin|meth|methamphetamine|marijuana|cannabis|weed|ganja|hashish|hash|opioid|fentanyl|lsd|mdma|ecstasy|ketamine|amphetamine|narcotic|steroid|steroids|prescription\s+medicine|controlled\s+substance)\b/i;
const databaseReady = (res) => { if (mongoose.connection.readyState !== 1) { res.status(503).json({ message: "Database is still connecting. Please refresh in a moment." }); return false; } return true; };
async function enrichItem(item) { const plainItem = item?.toObject ? item.toObject() : item; if (!plainItem?.ownerEmail) return { ...plainItem, ownerPhone: "", ownerProfilePicture: "", sellerRegistered: false }; const user = await User.findOne({ email: String(plainItem.ownerEmail).toLowerCase() }).select("phone profilePicture").lean(); return { ...plainItem, ownerPhone: user?.phone || "", ownerProfilePicture: user?.profilePicture || "", sellerRegistered: Boolean(user) }; }
router.post("/", (req,res) => upload.single("image")(req,res,async uploadError => { if(uploadError)return res.status(400).json({message:uploadError.message||"Image upload failed."}); try { if(!databaseReady(res))return; if(!req.file)return res.status(400).json({message:"Please upload an item image."}); const {title,category,listingType,price,description,condition,availability,displayStyle,owner,ownerEmail,urgent}=req.body; if(!title||!category||price===undefined||!description||!condition||!availability)return res.status(400).json({message:"All item details are required."}); const cleanOwnerEmail=String(ownerEmail||"").trim().toLowerCase(); if(!cleanOwnerEmail)return res.status(401).json({message:"Please sign in with a registered account before listing an item."}); const registeredUser=await User.findOne({email:cleanOwnerEmail}).select("nickname email").lean(); if(!registeredUser)return res.status(403).json({message:"Please use a registered Borrow Box account."}); if(prohibitedPattern.test(`${title} ${category} ${description}`))return res.status(400).json({message:"Drugs and controlled substances are strictly prohibited on Borrow Box."}); const cleanListingType=listingType==="sale"?"sale":"rent"; const numericPrice=Number(price); if(!Number.isFinite(numericPrice)||numericPrice<0)return res.status(400).json({message:"Please enter a valid price."}); const item=await Item.create({title:title.trim(),category,listingType:cleanListingType,price:numericPrice,description:description.trim(),condition,availability,owner:registeredUser.nickname||owner||"User",ownerEmail:registeredUser.email,imageUrl:`/uploads/${req.file.filename}`,displayStyle:displayStyle||"square",urgent:String(urgent).toLowerCase()==="true",status:"Available"}); return res.status(201).json({message:"Item listed successfully.",item:await enrichItem(item)}); } catch(error){console.error("CREATE ITEM ERROR:",error);return res.status(500).json({message:"Unable to list item."});} }));
router.get("/",async(_req,res)=>{try{if(!databaseReady(res))return;const items=await Item.find().sort({createdAt:-1}).lean();const emails=[...new Set(items.map(i=>String(i.ownerEmail||"").toLowerCase()).filter(Boolean))];const users=emails.length?await User.find({email:{$in:emails}}).select("email phone profilePicture").lean():[];const byEmail=new Map(users.map(u=>[String(u.email).toLowerCase(),{phone:u.phone||"",profilePicture:u.profilePicture||""}]));res.json({items:items.map(item=>({...item,ownerPhone:byEmail.get(String(item.ownerEmail||"").toLowerCase())?.phone||"",ownerProfilePicture:byEmail.get(String(item.ownerEmail||"").toLowerCase())?.profilePicture||"",sellerRegistered:byEmail.has(String(item.ownerEmail||"").toLowerCase())}))});}catch(error){console.error("GET ITEMS ERROR:",error);res.status(500).json({message:"Unable to load items."});}});
router.get("/:id",async(req,res)=>{try{if(!databaseReady(res))return;const item=await Item.findById(req.params.id).lean();if(!item)return res.status(404).json({message:"Item not found."});res.json({item:await enrichItem(item)});}catch(error){res.status(400).json({message:"Invalid item ID or unable to load item."});}});
router.put("/:id", (req,res) => upload.single("image")(req,res,async uploadError => {
 if(uploadError)return res.status(400).json({message:uploadError.message||"Image upload failed."});
 let newImagePath=null;
 try {
  if(!databaseReady(res))return;
  const id=String(req.params.id||"");
  if(!mongoose.isValidObjectId(id))return res.status(400).json({message:"Invalid item ID. Refresh My Items and try again."});
  const email=String(req.body.ownerEmail||"").trim().toLowerCase();
  if(!email)return res.status(400).json({message:"Your account email is required to manage this item."});
  const item=await Item.findById(id);
  if(!item)return res.status(404).json({message:"Item not found. Refresh My Items and try again."});
  if(String(item.ownerEmail||"").trim().toLowerCase()!==email)return res.status(403).json({message:"You can only manage items listed by your account."});
  if(item.status==="Borrowed"&&(req.body.status==="Sold"||req.body.status==="Unavailable"))return res.status(409).json({message:"This item is currently borrowed. Mark it available after it is returned."});
  const allowed=["title","category","listingType","price","description","condition","availability","displayStyle"];
  for(const key of allowed){if(req.body[key]!==undefined){if(typeof req.body[key]==="string"&&!req.body[key].trim())return res.status(400).json({message:key+" cannot be empty."});item[key]=req.body[key];}}
  if(req.body.listingType!==undefined&&!["rent","sale"].includes(req.body.listingType))return res.status(400).json({message:"Listing type must be Rent or Sale."});
  if(req.body.price!==undefined){const price=Number(req.body.price);if(!Number.isFinite(price)||price<0)return res.status(400).json({message:"Enter a valid non-negative price."});item.price=price;}
  if(req.body.status!==undefined){if(!["Available","Unavailable","Sold"].includes(req.body.status))return res.status(400).json({message:"Choose Available, Unavailable or Sold."});if(item.status==="Borrowed")return res.status(409).json({message:"A borrowed item cannot change status until it is returned."});item.status=req.body.status;}
  if(req.body.urgent!==undefined)item.urgent=String(req.body.urgent).toLowerCase()==="true";
  if(req.file){newImagePath=item.imageUrl?.startsWith("/uploads/")?path.join(__dirname,"..",item.imageUrl):null;item.imageUrl="/uploads/"+req.file.filename;}
  if(prohibitedPattern.test(item.title+" "+item.category+" "+item.description))return res.status(400).json({message:"Drugs and controlled substances are strictly prohibited on Borrow Box."});
  await item.save();
  if(newImagePath)fs.unlink(newImagePath,()=>{});
  return res.json({message:"Item updated successfully.",item:await enrichItem(item)});
 }catch(error){console.error("UPDATE ITEM ERROR:",error);return res.status(500).json({message:"Unable to update item."});}
}));
// Dedicated JSON endpoint for pausing/resuming a listing. This avoids multipart-form parsing for a simple status change.
router.patch("/:id/status",async(req,res)=>{
 try{
  if(!databaseReady(res))return;
  const id=String(req.params.id||"");
  if(!mongoose.isValidObjectId(id))return res.status(400).json({message:"Invalid item ID. Refresh My Items and try again."});
  const email=String(req.body?.ownerEmail||"").trim().toLowerCase();
  const status=String(req.body?.status||"");
  if(!email)return res.status(400).json({message:"Your account email is required to manage this item."});
  if(!["Available","Unavailable"].includes(status))return res.status(400).json({message:"Choose Available or Unavailable."});
  const item=await Item.findById(id);
  if(!item)return res.status(404).json({message:"Item not found. Refresh My Items and try again."});
  if(String(item.ownerEmail||"").trim().toLowerCase()!==email)return res.status(403).json({message:"You can only manage items listed by your account."});
  if(item.status==="Borrowed")return res.status(409).json({message:"This item is currently borrowed. You can change its listing status after it is returned."});
  if(item.status==="Sold")return res.status(409).json({message:"This item has already been sold and cannot be paused or reopened."});
  item.status=status;
  await item.save();
  return res.json({message:status==="Unavailable"?"Listing paused. It is now hidden from Browse.":"Listing is available again and visible in Browse.",item:await enrichItem(item)});
 }catch(error){console.error("CHANGE ITEM STATUS ERROR:",error);return res.status(500).json({message:"Unable to change listing status. Please try again."});}
});
router.delete("/:id",async(req,res)=>{try{if(!databaseReady(res))return;const {ownerEmail}=req.body||{};if(!ownerEmail)return res.status(400).json({message:"Seller email is required."});const item=await Item.findById(req.params.id);if(!item)return res.status(404).json({message:"Item not found."});if(String(item.ownerEmail||"").toLowerCase()!==String(ownerEmail).trim().toLowerCase())return res.status(403).json({message:"You can only delete your own item."});if(item.status==="Borrowed")return res.status(409).json({message:"A borrowed item cannot be deleted until it is returned."});const imagePath=item.imageUrl?.startsWith("/uploads/")?path.join(__dirname,"..",item.imageUrl):null;await Item.findByIdAndDelete(req.params.id);if(imagePath)fs.unlink(imagePath,()=>{});res.json({message:"Item deleted successfully."});}catch(error){console.error("DELETE ITEM ERROR:",error);res.status(500).json({message:"Unable to delete item."});}});
module.exports=router;
