/**
 * Viyra.comâ„¢
 * Developed by SaaSolutions SL
 * Intellectual Property owned by Paradox FZCO
 * Â© 2026 Paradox FZCO. All rights reserved.
 */
export type Role = 'buyer'|'seller'|'realtor'|'photographer'|'lawyer'|'notary'|'firm_owner'|'firm_admin'|'admin'|'super_admin';
export interface User { id:string; name:string; role:Role; language:string; market:string }
export interface PropertyMedia { id:string; url:string; type:'image'|'video'|'floorplan' }
export interface PropertyFeature { name:string; value:string|boolean|number }
export interface Property { id:string; title:string; country:string; city:string; price:number; media:PropertyMedia[]; features:PropertyFeature[]; aiMatch:number }
export interface BuyerPreferenceProfile { budget:number; preferredCountries:string[]; familySize:number; privacyNeeds:string; culturalNeeds:string[]; remotePurchase:boolean }
export interface AIMatchResult { propertyId:string; score:number; explanation:string; warnings:string[]; investmentScore:number }
export interface Offer { id:string; propertyId:string; buyerId:string; offerAmount:number; depositAmount:number; financingType:string; desiredClosingDate:string; conditions:string }
export interface TransactionStage { key:string; status:'pending'|'active'|'blocked'|'complete'; responsibleRole:Role; deadline:string; requiredAction:string; documents:string[]; bottleneckReason?:string; aiExplanation:string; risk:'low'|'medium'|'high'; nextAction:string }
export interface Transaction { id:string; propertyId:string; stages:TransactionStage[]; progress:number }
export interface Document { id:string; type:string; status:'Missing'|'Uploaded'|'Under review'|'Approved'|'Rejected'; responsibleParty:Role; uploadDate?:string; expiryDate?:string; reviewNotes?:string }
export interface Notification { id:string; message:string; userId:string; createdAt:string }
export interface Market { code:string; country:string; currency:string; defaultLanguage:string; languages:string[] }
export interface LegalWorkflow { marketCode:string; steps:string[]; countrySpecificDocuments:string[]; taxNotes:string; residencyNotes:string }
export interface AgentAction { id:string; severity:'low'|'medium'|'high'; message:string; transactionId:string }
export interface Message { id:string; from:string; to:string; content:string; createdAt:string }
